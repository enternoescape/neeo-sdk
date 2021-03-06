'use strict';

const url = require('fast-url-parser');
const config = require('../../config');
const validate = require('./helper');

const LIST_MAX_LIMIT = config.maxListItemsPerPage;
const MAX_BUTTONS_PER_ROW = config.maxButtonsPerRow;
const MAX_TILES_PER_ROW = config.maxTilesPerRow;

const AVAILABLE_BUTTON_ICON_NAMES = [
  'shuffle',
  'repeat',
];

module.exports = {
  validateTitle,
  validateRow,
  validateThumbnail,
  validateItemParams,
  validateButton,
  validateLimit,
  validateList,
  validateButtonIcon,
};

function validateTitle(title) {
  if (!title) {
    return '';
  }
  return title;
}

function validateRow(definitions, type) {
  const isNotArray = !Array.isArray(definitions);
  if (isNotArray) {
    throw new Error(`ERROR_LIST_${type.toUpperCase()}_NO_ARRAY`);
  }

  if (type === 'tiles' && definitions.length > MAX_TILES_PER_ROW) {
    throw new Error(`ERROR_LIST_TILES_TOO_MANY_TILES, used: ${definitions.length} / allowed: ${MAX_TILES_PER_ROW}`);
  }

  if (type === 'buttons' && definitions.length > MAX_BUTTONS_PER_ROW) {
    throw new Error(`ERROR_LIST_BUTTONS_TOO_MANY_BUTTONS, used: ${definitions.length} / allowed: ${MAX_BUTTONS_PER_ROW}`);
  }
}

function validateThumbnail(thumbnail) {
  if (!thumbnail) {
    throw new Error('ERROR_LIST_THUMBNAIL_EMPTY');
  }

  const parsedThumbnailURI = url.parse(thumbnail);
  if (parsedThumbnailURI && !parsedThumbnailURI.host) {
    throw new Error('ERROR_LIST_THUMBNAIL_NO_URL');
  }

  return thumbnail;
}

function validateItemParams(params) {
  if (!params) {
    throw new Error('ERROR_LIST_ITEM_PARAMS_EMPTY');
  }

  return params;
}

function validateButton(params) {
  if (!params || (!params.title && !params.iconName)) {
    throw new Error('ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY');
  }
}

function validateLimit(limit) {
  const isFiniteAndPositive = Number.isFinite(limit) && limit >= 0;

  if (!isFiniteAndPositive) {
    return LIST_MAX_LIMIT;
  }

  if (isFiniteAndPositive && limit > LIST_MAX_LIMIT) {
    throw new Error(`ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED, used: ${limit} / max: ${LIST_MAX_LIMIT}`);
  }

  return limit;
}

function validateList(list) {
  validate(list, {
    _meta: { presence: true },
  });

  validate(list._meta, {
    current: { presence: true },
  });

  ['current', 'previous', 'next'].forEach((key) => {
    if (list._meta[key]) {
      const hasValidBrowseIdentifier = list._meta[key].browseIdentifier;
      if (hasValidBrowseIdentifier) {
        validate.isString(hasValidBrowseIdentifier);
      }
      validate.isInteger(list._meta[key].offset);
      validate.isInteger(list._meta[key].limit);
    }
  });

  validate.isArray(list.items);

  list.items.forEach((item) => {
    if (item.isHeader) {
      return validate(item, {
        title: { presence: true },
      });
    }

    if (item.title) {
      validate.isString(item.title);
    }

    if (item.label) {
      validate.isString(item.label);
    }

    if (item.thumbnailUri) {
      validate.isString(item.thumbnailUri);
    }

    if (item.browseIdentifier) {
      validate.isString(item.browseIdentifier);
    }

    if (item.actionIdentifier) {
      validate.isString(item.actionIdentifier);
    }
  });
}

function validateButtonIcon(iconName) {
  if (typeof iconName !== 'string') {
    return;
  }
  if (AVAILABLE_BUTTON_ICON_NAMES.includes(iconName.toLowerCase())) {
    return iconName;
  }
  throw new Error(`INVALID_ICON_NAME: ${iconName}`);
}
