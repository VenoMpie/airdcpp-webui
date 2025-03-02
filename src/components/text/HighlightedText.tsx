import { memo } from 'react';
import * as React from 'react';

import { useLocation } from 'react-router-dom';
import { Location } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatEmojis } from 'utils/EmojiFormat';

import { HighlightBold, HighlightMagnet, HighlightUrlLink, HighlightTextLink } from './highlights';


interface HighlightProps {
  user: UI.DownloadSource | undefined;
  menuProps: UI.MessageActionMenuData;
}

const getHighlightNode = (
  highlight: API.MessageHighlight, 
  location: Location, 
  t: TFunction,
  { user, menuProps }: HighlightProps
): React.ReactNode => {
  const { start, end } = highlight.position;
  const key = `${start}-${end}`;
  switch (highlight.type) {
    case API.MessageHighlightTypeEnum.BOLD:
    case API.MessageHighlightTypeEnum.USER:
      return (
        <HighlightBold
          key={ key }
          text={ highlight.text }
        />
      );
    case API.MessageHighlightTypeEnum.LINK_TEXT:
      return (
        <HighlightTextLink
          key={ key }
          highlightId={ highlight.id }
          text={ highlight.text }
          menuProps={ menuProps }
        />
      );
    case API.MessageHighlightTypeEnum.LINK_URL: {
      if (highlight.text.startsWith('magnet:?') && highlight.content_type !== null) {
        return (
          <HighlightMagnet
            key={ key }
            text={ highlight.text }
            dupe={ highlight.dupe }
            contentType={ highlight.content_type }
            user={ user }
            highlightId={ highlight.id }
            t={ t }
            menuProps={ menuProps }
          />
        );
      }

      return (
        <HighlightUrlLink
          key={ key }
          text={ highlight.text }
          location={ location }
        />
      );
    }
    default: {
      return highlight.text;
    }
  }
};

interface HighlightedTextProps extends HighlightProps {
  text: string;
  highlights: API.MessageHighlight[];
  emojify?: boolean;
}

const formatPlainText = (text: string, emojify: boolean | undefined) => {
  return emojify ? formatEmojis(text) : text; 
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const formatHighlights = (
  { text: text16, highlights, emojify, ...other }: HighlightedTextProps, 
  location: Location, 
  t: TFunction
) => {
  if (!highlights.length) {
    return formatPlainText(text16, emojify);
  }

  // Highlight positions received from the API are for UTF-8, while JS uses UTF-16
  // Convert the text to UTF-8 to avoid incorrect formatting results
  const text8 = encoder.encode(text16);

  let prevReplace = 0;
  const elements: React.ReactNode[] = [];
  const pushText = (newStart: number) => {
    let textElement: React.ReactNode = formatPlainText(
      decoder.decode(text8.subarray(prevReplace, newStart)),
      emojify
    );

    elements.push(textElement);
  };

  for (const highlight of highlights) {
    const { start, end } = highlight.position;

    pushText(start);
    elements.push(getHighlightNode(highlight, location, t, other));

    prevReplace = end;
  }

  if (prevReplace !== text8.length) {
    pushText(text8.length);
  }

  return elements;
};

export const HighlightedText: React.FC<HighlightedTextProps> = memo((
  props
) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <>
      { formatHighlights(props, location, t) }
    </>
  );
});
