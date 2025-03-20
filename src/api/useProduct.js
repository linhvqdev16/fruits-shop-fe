import { data } from 'jquery'
import useRequest from './useRequest'
const useType = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('product')
	const getList = (params) => createGetRequest({
		endpoint: '/get-list-product',
		params: params
	})
    const getById = (id) => createGetRequest({
		endpoint: '/detail',
		params: {id: id}
	})
	const addOrChange  = (data, headers) => createPostRequest({
		endpoint: '/add-or-change',
		data: data,
		headers: headers
	})
	const changeStatus = (params, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: params, status: status}
	})
	const generateCode = () => createGetRequest({
		endpoint: '/generate-code', 
		params: null
	})
	return {
		generateCode, 
		changeStatus, 
		addOrChange, 
		getById, 
		getList
	}
}

export default useType