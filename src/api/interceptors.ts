import { getAccessToken, removeFromStorage } from '@/services/auth-token.service'
import axios, {type CreateAxiosDefaults} from 'axios'
import { errorCatch } from './error'
import { authService } from '@/services/auth.service'

const options: CreateAxiosDefaults = {
	baseURL: process.env.SERVER_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const JWT_EXPIRED = 'jwt expired'
const JWT_MUST_PROVIDED = 'jwt must be provided'

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken) 
		config.headers.Authorization = `Bearer ${accessToken}`
	
	return config
})

axiosWithAuth.interceptors.response.use(
	config => config, 
	async error => {
		const originalRequest = error.config
		if (
			(error?.response?.status === 401 || 
			errorCatch(error) === JWT_EXPIRED ||
			errorCatch(error) === JWT_MUST_PROVIDED) && 
			error.config && !error.config._isRetry) {
				originalRequest._isRetry = true
				try {
					await authService.getNewTokens()			
					return axiosWithAuth.request(originalRequest)	
				} catch (error) {
					if (errorCatch(error) === 'jwt expired') removeFromStorage()
				}
			}
			
		throw error
	}
)
export {axiosClassic, axiosWithAuth}