/**
 * CRUD operation suffixes for consistent action type naming.
 */
export const CRUD_ACTION_SUFFIXES = {
	FETCH_ALL: '/fetchAll',
	FETCH_BY_PARAM: '/fetchByParam',
	CREATE_ONE: '/createOne',
	UPDATE_ONE: '/updateOne',
	DELETE_ONE: '/deleteOne',
} as const;
