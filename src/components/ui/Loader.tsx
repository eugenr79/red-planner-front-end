import { Loader as LoaderIcon } from 'lucide-react'

export default function Loader() {
	return (
		<div className='flex justify-center items-center'>
			<LoaderIcon className='animate-spin h-5 w-5 text-white' />
		</div>
	)
}