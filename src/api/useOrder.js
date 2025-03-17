import useRequest from './useRequest'

const useOrder = () => {
    const { createPostRequest, createGetRequest, createPutRequest, cancel } = useRequest('order')

    const getAll = (data) => createPostRequest({
		endpoint: '/getall',
		data: data
	})
    const create = (data) => createPostRequest({
		endpoint: '/create',
		data: data
	})
	const getDetail = (params) => createGetRequest({
		endpoint: '/detail',
		params: params
	})
	const edit = (params,data) => createPutRequest({
		endpoint: '/Edit',
		params: params,
		data: data
	})
	const generateCode = () => createGetRequest({
		endpoint: '/generate-code', 
		params: null
	})
	return {
		getAll,
		create,
		getDetail,
		edit,
		generateCode
	}
} 
export default useOrder