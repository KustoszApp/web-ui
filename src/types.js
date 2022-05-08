/* eslint-disable */

//
// Vuex store
//

// auth
export const GET_HAS_TOKEN = "GET_HAS_TOKEN";
export const MUTATION_SET_TOKEN = "MUTATION_SET_TOKEN";
export const MUTATION_REMOVE_TOKEN = "MUTATION_REMOVE_TOKEN";
export const MUTATION_AUTH_LOGIN_REQUEST = "MUTATION_AUTH_LOGIN_REQUEST";
export const MUTATION_AUTH_LOGIN_SUCCESS = "MUTATION_AUTH_LOGIN_SUCCESS";
export const MUTATION_AUTH_LOGIN_ERROR = "MUTATION_AUTH_LOGIN_ERROR";
export const ACTION_AUTH_LOGIN = "ACTION_AUTH_LOGIN";
export const ACTION_AUTH_LOGOUT = "ACTION_AUTH_LOGOUT";
export const ACTION_CHECK_TOKEN = "ACTION_CHECK_TOKEN";

// channels
export const GET_CHANNELS = "GET_CHANNELS";
export const GET_CHANNEL_TAGS = "GET_CHANNEL_TAGS";
export const MUTATION_CHANNELS_REQUEST = "MUTATION_CHANNELS_REQUEST";
export const MUTATION_CHANNELS_SUCCESS = "MUTATION_CHANNELS_SUCCESS";
export const MUTATION_CHANNELS_ERROR = "MUTATION_CHANNELS_ERROR";
export const MUTATION_CHANNEL_CREATE_REQUEST = "MUTATION_CHANNEL_CREATE_REQUEST";
export const MUTATION_CHANNEL_CREATE_SUCCESS = "MUTATION_CHANNEL_CREATE_SUCCESS";
export const MUTATION_CHANNEL_CREATE_ERROR = "MUTATION_CHANNEL_CREATE_ERROR";
export const MUTATION_CHANNEL_EDIT_SUCCESS = "MUTATION_CHANNEL_EDIT_SUCCESS";
export const MUTATION_CHANNEL_EDIT_ERROR = "MUTATION_CHANNEL_EDIT_ERROR";
export const MUTATION_CHANNEL_TAGS_REQUEST = "MUTATION_CHANNEL_TAGS_REQUEST";
export const MUTATION_CHANNEL_TAGS_SUCCESS = "MUTATION_CHANNEL_TAGS_SUCCESS";
export const MUTATION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE = "MUTATION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE";
export const ACTION_CHANNELS_REQUEST = "ACTION_CHANNELS_REQUEST";
export const ACTION_CHANNEL_CREATE_REQUEST = "ACTION_CHANNEL_CREATE_REQUEST";
export const ACTION_CHANNEL_EDIT_REQUEST = "ACTION_CHANNEL_EDIT_REQUEST";
export const ACTION_CHANNEL_TAGS_REQUEST = "ACTION_CHANNEL_TAGS_REQUEST";
export const ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE = "ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE";

// entries
export const GET_ENTRIES = "GET_ENTRIES";
export const GET_ENTRIES_REQUEST_PARAMS = "GET_ENTRIES_REQUEST_PARAMS";
export const GET_ENTRIES_NEXT_PAGE = "GET_ENTRIES_NEXT_PAGE";
export const GET_ENTRIES_ALL_COUNT = "GET_ENTRIES_ALL_COUNT";
export const GET_ENTRY_TAGS = "GET_ENTRY_TAGS";
export const GET_STATUS = "GET_STATUS";
export const MUTATION_SET_ENTRIES_REQUEST_PARAMS = "MUTATION_SET_ENTRIES_REQUEST_PARAMS";
export const MUTATION_ENTRIES_REQUEST = "MUTATION_ENTRIES_REQUEST";
export const MUTATION_ENTRIES_SUCCESS = "MUTATION_ENTRIES_SUCCESS";
export const MUTATION_ENTRIES_ERROR = "MUTATION_ENTRIES_ERROR";
export const MUTATION_ENTRIES_MARK_AS_READ_SUCCESS = "MUTATION_ENTRIES_MARK_AS_READ_SUCCESS";
export const MUTATION_ENTRY_REQUEST = "MUTATION_ENTRY_REQUEST";
export const MUTATION_ENTRY_SUCCESS = "MUTATION_ENTRY_SUCCESS";
export const MUTATION_ENTRY_ERROR = "MUTATION_ENTRY_ERROR";
export const MUTATION_ENTRY_TAGS_REQUEST = "MUTATION_ENTRY_TAGS_REQUEST";
export const MUTATION_ENTRY_TAGS_SUCCESS = "MUTATION_ENTRY_TAGS_SUCCESS";
export const ACTION_ENTRIES_REQUEST = "ACTION_ENTRIES_REQUEST";
export const ACTION_ENTRIES_NEXT_PAGE_REQUEST = "ACTION_ENTRIES_NEXT_PAGE_REQUEST";
export const ACTION_ENTRIES_MARK_AS_READ = "ACTION_ENTRIES_MARK_AS_READ";
export const ACTION_ENTRY_REQUEST = "ACTION_ENTRY_REQUEST";
export const ACTION_ENTRY_EDIT_REQUEST = "ACTION_ENTRY_EDIT_REQUEST";
export const ACTION_ENTRY_TAGS_REQUEST = "ACTION_ENTRY_TAGS_REQUEST";

// filters
export const GET_TRY_FILTER_STATUS = "GET_TRY_FILTER_STATUS";
export const GET_TRY_FILTER_ENTRIES_ALL_COUNT = "GET_TRY_FILTER_ENTRIES_ALL_COUNT";
export const GET_TRY_FILTER_ENTRIES = "GET_TRY_FILTER_ENTRIES";
export const GET_FILTERS = "GET_FILTERS";
export const GET_CURRENT_FILTER = "GET_CURRENT_FILTER";
export const MUTATION_FILTERS_REQUEST = "MUTATION_FILTERS_REQUEST";
export const MUTATION_FILTERS_SUCCESS = "MUTATION_FILTERS_SUCCESS";
export const MUTATION_FILTERS_ERROR = "MUTATION_FILTERS_ERROR";
export const MUTATION_FILTER_CREATE_REQUEST = "MUTATION_FILTER_CREATE_REQUEST";
export const MUTATION_FILTER_CREATE_SUCCESS = "MUTATION_FILTER_CREATE_SUCCESS";
export const MUTATION_FILTER_CREATE_ERROR = "MUTATION_FILTER_CREATE_ERROR";
export const MUTATION_FILTER_EDIT_REQUEST = "MUTATION_FILTER_EDIT_REQUEST";
export const MUTATION_FILTER_EDIT_SUCCESS = "MUTATION_FILTER_EDIT_SUCCESS";
export const MUTATION_FILTER_EDIT_ERROR = "MUTATION_FILTER_EDIT_ERROR";
export const MUTATION_FILTER_DELETE_REQUEST = "MUTATION_FILTER_DELETE_REQUEST";
export const MUTATION_FILTER_DELETE_SUCCESS = "MUTATION_FILTER_DELETE_SUCCESS";
export const MUTATION_FILTER_DELETE_ERROR = "MUTATION_FILTER_DELETE_ERROR";
export const MUTATION_FILTER_TRY_DATA_RESET = "MUTATION_FILTER_TRY_DATA_RESET";
export const MUTATION_FILTER_TRY_REQUEST = "MUTATION_FILTER_TRY_REQUEST";
export const MUTATION_FILTER_TRY_SUCCESS = "MUTATION_FILTER_TRY_SUCCESS";
export const MUTATION_FILTER_TRY_ERROR = "MUTATION_FILTER_TRY_ERROR";
export const ACTION_FILTERS_REQUEST = "ACTION_FILTERS_REQUEST";
export const ACTION_FILTER_CREATE_REQUEST = "ACTION_FILTER_CREATE_REQUEST";
export const ACTION_FILTER_EDIT_REQUEST = "ACTION_FILTER_EDIT_REQUEST";
export const ACTION_FILTER_DELETE_REQUEST = "ACTION_FILTER_DELETE_REQUEST";
export const ACTION_FILTER_TRY_DATA_RESET = "ACTION_FILTER_TRY_DATA_RESET";
export const ACTION_FILTER_TRY_REQUEST = "ACTION_FILTER_TRY_REQUEST";

// maintenance
export const GET_MAINTENANCE_CHANNELS = "GET_MAINTENANCE_CHANNELS";
export const MUTATION_MAINTENANCE_CHANNELS_REQUEST = "MUTATION_MAINTENANCE_CHANNELS_REQUEST";
export const MUTATION_MAINTENANCE_CHANNELS_SUCCESS = "MUTATION_MAINTENANCE_CHANNELS_SUCCESS";
export const MUTATION_MAINTENANCE_CHANNELS_ERROR = "MUTATION_MAINTENANCE_CHANNELS_ERROR";
export const MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS = "MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS";
export const MUTATION_MAINTENANCE_CHANNELS_DELETE_SUCCESS = "MUTATION_MAINTENANCE_CHANNELS_DELETE_SUCCESS";
export const MUTATION_MAINTENANCE_SET_LAST_GET_URL = "MUTATION_MAINTENANCE_SET_LAST_GET_URL";
export const ACTION_MAINTENANCE_CHANNELS_GET_REQUEST = "ACTION_MAINTENANCE_CHANNELS_GET_REQUEST";
export const ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST = "ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST";
export const ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST = "ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST";
export const ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST = "ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST";

// user
export const GET_USER = "GET_USER";
export const GET_USER_THEME_COLOR = "GET_USER_THEME_COLOR";
export const MUTATION_CLEAR_USER_DATA = "MUTATION_CLEAR_USER_DATA";
export const MUTATION_SET_USER_THEME_COLOR = "MUTATION_SET_USER_THEME_COLOR";
export const MUTATION_USER_DATA_REQUEST = "MUTATION_USER_DATA_REQUEST";
export const MUTATION_USER_DATA_SUCCESS = "MUTATION_USER_DATA_SUCCESS";
export const MUTATION_USER_DATA_ERROR = "MUTATION_USER_DATA_ERROR";
export const MUTATION_USER_DATA_EDIT_REQUEST = "MUTATION_USER_DATA_EDIT_REQUEST";
export const MUTATION_USER_DATA_EDIT_SUCCESS = "MUTATION_USER_DATA_EDIT_SUCCESS";
export const MUTATION_USER_DATA_EDIT_ERROR = "MUTATION_USER_DATA_EDIT_ERROR";
export const ACTION_SET_USER_THEME_COLOR = "ACTION_SET_USER_THEME_COLOR";
export const ACTION_USER_DATA_REQUEST = "ACTION_USER_DATA_REQUEST";
export const ACTION_USER_DATA_EDIT_REQUEST = "ACTION_USER_DATA_EDIT_REQUEST";

// views
export const GET_SIDEBAR_STATE = "GET_SIDEBAR_STATE";
export const GET_ALL_COLOR_THEMES = "GET_ALL_COLOR_THEMES";
export const GET_DEFAULT_THEME_COLOR = "GET_DEFAULT_THEME_COLOR";
export const MUTATION_SIDEBAR_DISPLAYED = "MUTATION_SIDEBAR_DISPLAYED";
export const MUTATION_SIDEBAR_HIDDEN = "MUTATION_SIDEBAR_HIDDEN";
export const ACTION_DISPLAY_SIDEBAR = "ACTION_DISPLAY_SIDEBAR";
export const ACTION_HIDE_SIDEBAR = "ACTION_HIDE_SIDEBAR";

//
// Route names
//

export const ROUTE_LOGIN = "login";
export const ROUTE_ENTRIES = "entries";
export const ROUTE_FILTERS = "filters";
export const ROUTE_SETTINGS = "settings";
export const ROUTE_MAINTENANCE_STALE_CHANNELS = "maintenance_stale_channels";
export const ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS = "maintenance_not_updated_channels";
export const ROUTE_MAINTENANCE_INACTIVE_CHANNELS = "maintenance_inactive_channels";


//
// Named refs
//

export const REF_SIDEBAR = "REF_SIDEBAR";
