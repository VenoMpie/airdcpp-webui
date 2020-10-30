import PropTypes from 'prop-types';
import { Component } from 'react';

import 'fomantic-ui-css/components/accordion';
import 'fomantic-ui-css/components/accordion.min.css';

import classNames from 'classnames';


interface AccordionProps {
  controlled?: boolean;
  className?: string;
}

class Accordion extends Component<AccordionProps> {
  static propTypes = {
    controlled: PropTypes.bool,
  };

  static defaultProps: Pick<AccordionProps, 'className'> = {
    className: '',
  };

  c: HTMLDivElement;
  componentDidMount() {
    let settings: SemanticUI.AccordionSettings | undefined;
    
    if (this.props.controlled) {
      settings = {
        on: 'disabled',
      };
    }

    $(this.c).accordion(settings);
  }

  render() {
    const accordionStyle = classNames(
      'ui accordion',
      this.props.className,
    );

    let { children } = this.props;
    return (
      <div 
        ref={ c => this.c = c! } 
        className={ accordionStyle }
      >
        { children }
      </div>
    );
  }
}

export default Accordion;
