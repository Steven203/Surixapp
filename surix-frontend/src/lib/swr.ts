export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  onError: (error: Error) => {
    if (error.message === 'Sesión expirada') return
    console.error('SWR Error:', error)
  },
}