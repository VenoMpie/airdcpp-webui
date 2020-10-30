import * as React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import Accordion from 'components/semantic/Accordion';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import LogSection from 'routes/Settings/routes/System/components/LogSection';
import Message from 'components/semantic/Message';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import IconConstants from 'constants/IconConstants';

const Entry = [
  'log_directory',
];

const sections = [
  'main',
  'pm',
  'downloads',
  'uploads',
  'syslog',
  'status',
];

const LoggingPage: React.FC<SettingSectionChildProps> = props => {
  const { t, translate } = props.moduleT;
  return (
    <div>
      <RemoteSettingForm
        { ...props }
        keys={ Entry }
      />
      <div className="sections">
        <div className="ui header">
          { translate('Sections') }
        </div>
        <Message
          icon={ IconConstants.INFO }
          description={
            <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>
              { t('variableHelp', 'Variable information for Filename and Format fields') }
            </ExternalLink>
          }
        />
        <Accordion className="styled" controlled={ true }>
          { sections.map(section => (
            <LogSection 
              { ...props }
              key={ section } 
              section={ section }
            />
          )) }
        </Accordion>
      </div>
    </div>
  );
};

export default LoggingPage;