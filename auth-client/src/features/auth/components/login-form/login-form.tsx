'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'

import { Button, Input, Label } from '@/shared/components/ui'

import { usePassword } from '../../hooks/use-password'
import { LoginSchema, TypeLoginSchema } from '../../schemas'

import { AuthWrapper } from '@/widgets'

export function LoginForm() {
  const { isPasswordVisible, onPasswordVisible } = usePassword()

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema as never),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const handleSubmit = (values: TypeLoginSchema) => {
    console.log(values)
  }

  return (
    <AuthWrapper
      heading='Войти'
      description='Чтобы войти в систему введите ваш email и пароль'
      backButtonLabel='Еще нет аккаунта? Регистрация'
      backButtonHref='/auth/register'
      isSocialShown
    >
      <form className='space-y-2' onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='example@mail.com'
            {...form.register('email')}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <p className='text-destructive text-xs'>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='password'>Пароль</Label>
          <div className='relative'>
            <Input
              id='password'
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder='Введите пароль'
              className='pr-8'
              {...form.register('password')}
              aria-invalid={!!form.formState.errors.password}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              className='absolute top-1/2 right-1 -translate-y-1/2'
              onClick={onPasswordVisible}
              aria-label={
                isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'
              }
            >
              {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className='text-destructive text-xs'>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          Войти в аккаунт
        </Button>
      </form>
    </AuthWrapper>
  )
}
