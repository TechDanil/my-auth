import { useState } from 'react'

export const usePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] = useState(false)

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev)
  }

  const handleRepeatPasswordVisibility = () => {
    setIsPasswordRepeatVisible(prev => !prev)
  }

  return {
    isPasswordVisible,
    isPasswordRepeatVisible,
    onPasswordVisible: handlePasswordVisibility,
    onRepeatPasswordVisible: handleRepeatPasswordVisibility
  }
}
