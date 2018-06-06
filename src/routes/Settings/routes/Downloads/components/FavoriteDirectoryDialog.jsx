import React from 'react';
import Modal from 'components/semantic/Modal';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';
import { FieldTypes } from 'constants/SettingConstants';

import { getLastDirectory } from 'utils/FileUtils';

import Form from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';


const Entry = [
  {
    key: 'path',
    type: FieldTypes.DIRECTORY_PATH,
  },
  {
    key: 'name',
    type: FieldTypes.STRING,
  },
];

class FavoriteDirectoryDialog extends React.Component {
  static displayName = 'FavoriteDirectoryDialog';

  isNew = () => {
    return !this.props.directoryEntry;
  };

  onFieldChanged = (id, value, hasChanges) => {
    if (id.indexOf('path') !== -1) {
      return Promise.resolve({
        name: getLastDirectory(value.path) 
      });
    }

    return null;
  };

  save = () => {
    return this.form.save();
  };

  onSave = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(FavoriteDirectoryConstants.DIRECTORIES_URL, changedFields);
    }

    return SocketService.patch(FavoriteDirectoryConstants.DIRECTORIES_URL + '/' + this.props.directoryEntry.id, changedFields);
  };

  onFieldSetting = (id, fieldOptions, formValue) => {
    if (id === 'path') {
      fieldOptions['disabled'] = !this.isNew();
      fieldOptions['config'] = Object.assign(fieldOptions['config'] || {}, {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'name') {
      fieldOptions['factory'] = t.form.Textbox;
      fieldOptions['template'] = AutoSuggestField;
      fieldOptions['config'] = {
        suggestionGetter: () => this.props.virtualNames,
      };
    }
  };

  render() {
    const title = this.isNew() ? 'Add favorite directory' : 'Edit favorite directory';
    return (
      <Modal 
        className="favorite-directory" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FOLDER } 
        {...this.props}
      >
        <Form
          ref={ c => this.form = c }
          fieldDefinitions={ Entry }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ this.props.directoryEntry }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(
  DataProviderDecorator(FavoriteDirectoryDialog, {
    urls: {
      virtualNames: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
    },
    dataConverters: {
      virtualNames: data => data.map(item => item.name, []),
    },
  }),
  OverlayConstants.FAVORITE_DIRECTORY_MODAL,
  'directory'
);