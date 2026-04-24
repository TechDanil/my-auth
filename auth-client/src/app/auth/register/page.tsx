import { Metadata } from 'next'

import { RegisterForm } from '@/features'

export const metadata: Metadata = {
  title: 'Создать аккаунт'
}

export default function RegisterPage() {
  return <RegisterForm />
}
