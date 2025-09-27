import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const SymptomEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['symptom', id], () => api.get(`/symptoms/${id}`), { enabled: !!id })
  const symptom = data?.data?.data?.symptom

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (symptom) {
      reset({
        name: symptom.name,
        description: symptom.description || '',
        severity: symptom.severity,
        status: symptom.status || 'active',
      })
    }
  }, [symptom, reset])

  const updateMutation = useMutation((payload) => api.put(`/symptoms/${id}`, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries('symptoms')
      queryClient.invalidateQueries(['symptom', id])
      queryClient.invalidateQueries('symptom-stats')
      navigate(`/symptoms/${id}`)
    }
  })

  const onSubmit = (values) => {
    updateMutation.mutate(values)
  }

  if (isLoading || !symptom) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Symptom</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input {...register('name', { required: 'Name is required' })} className={`input ${errors.name ? 'input-error' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea rows={3} {...register('description')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity (1-10)</label>
              <input type="number" min={1} max={10} {...register('severity', { valueAsNumber: true })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select {...register('status')} className="input">
                <option value="active">Active</option>
                <option value="improving">Improving</option>
                <option value="resolved">Resolved</option>
                <option value="worsening">Worsening</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          <button type="submit" disabled={updateMutation.isLoading} className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  )
}

export default SymptomEdit


