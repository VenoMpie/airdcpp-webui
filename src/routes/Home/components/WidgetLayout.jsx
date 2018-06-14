import React, { Fragment } from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import invariant from 'invariant';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Widget from './Widget';
import WidgetDialog from './WidgetDialog';

import { Responsive, WidthProvider } from 'react-grid-layout';
import WidgetStore from 'stores/WidgetStore';


import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import 'semantic-ui/components/card.min.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const WidgetLayout = createReactClass({
  displayName: 'WidgetLayout',
  mixins: [ PureRenderMixin, Reflux.connect(WidgetStore, 'layouts') ],

  getInitialState() {
    return {
      breakpoint: 'lg',
    };
  },

  // Convert a layout entry to a component
  mapWidget(layoutItem) {
    const widgetInfo = WidgetStore.getWidgetInfoById(layoutItem.i);
    invariant(widgetInfo, 'Widget info missing');
    if (!widgetInfo) {
      return null;
    }

    const settings = WidgetStore.getWidgetSettings(layoutItem.i, widgetInfo);
    return (
      <Widget
        key={ layoutItem.i }
        componentId={ layoutItem.i }
        widgetInfo={ widgetInfo }
        settings={ settings }
        data-grid={ layoutItem }
      />
    );
  },

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint,
    });
  },

  render() {
    return (
      <Fragment>
        <ResponsiveReactGridLayout 
          className="ui cards layout"
          rowHeight={50} 
          width={1200}
          onLayoutChange={ WidgetStore.onLayoutChange }
          onBreakpointChange={ this.onBreakpointChange }

          breakpoints={ WidgetStore.breakpoints }
          cols={ WidgetStore.cols }

          draggableHandle=".react-grid-item .header-row .header"
          layouts={ this.state.layouts }
        >
          { this.state.layouts[this.state.breakpoint]
            .map(this.mapWidget)
            .filter(widget => widget) }
        </ResponsiveReactGridLayout>
        <WidgetDialog/>
      </Fragment>
    );
  },
});

export default WidgetLayout;