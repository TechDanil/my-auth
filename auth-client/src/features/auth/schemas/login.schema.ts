import { z } from 'zod'

export const LoginSchema = z.object({
  name: z.string().min(1, {
    message: 'Введите имя'
  }),
  email: z.email({
    message: 'Некорректная почта'
  }),
  password: z.string().min(6, {
    message: 'Пароль минимум 6 символов'
  })
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
