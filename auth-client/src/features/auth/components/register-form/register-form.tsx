'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Input, Label } from '@/shared/components/ui'

import { RegisterSchema, TypeRegisterSchema } from '../../schemas'

import { AuthWrapper } from '@/widgets'

export function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] =
    useState(false)

  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema as never),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  })

  const handleSubmit = (values: TypeRegisterSchema) => {
    console.log(values)
  }

  return (
    <AuthWrapper
      heading='Регистрация'
      description='Создайте аккаунт для доступа к системе'
      backButtonLabel='Назад'
      backButtonHref='/auth/login'
      isSocialShown
    >
      <form
        className='space-y-2'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Имя</Label>
          <Input
            id='name'
            placeholder='Введите имя'
            {...form.register('name')}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <p className='text-destructive text-xs'>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

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
              onClick={() => setIsPasswordVisible(prev => !prev)}
              aria-label={
                isPasswordVisible
                  ? 'Скрыть пароль'
                  : 'Показать пароль'
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

        <div className='space-y-1.5'>
          <Label htmlFor='passwordRepeat'>Подтвердите пароль</Label>
          <div className='relative'>
            <Input
              id='passwordRepeat'
              type={isPasswordRepeatVisible ? 'text' : 'password'}
              placeholder='Повторите пароль'
              className='pr-8'
              {...form.register('passwordRepeat')}
              aria-invalid={
                !!form.formState.errors.passwordRepeat
              }
            />
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              className='absolute top-1/2 right-1 -translate-y-1/2'
              onClick={() =>
                setIsPasswordRepeatVisible(prev => !prev)
              }
              aria-label={
                isPasswordRepeatVisible
                  ? 'Скрыть пароль'
                  : 'Показать пароль'
              }
            >
              {isPasswordRepeatVisible ? (
                <EyeSlashIcon />
              ) : (
                <EyeIcon />
              )}
            </Button>
          </div>
          {form.formState.errors.passwordRepeat && (
            <p className='text-destructive text-xs'>
              {form.formState.errors.passwordRepeat.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          Зарегистрироваться
        </Button>
      </form>
    </AuthWrapper>
  )
}
