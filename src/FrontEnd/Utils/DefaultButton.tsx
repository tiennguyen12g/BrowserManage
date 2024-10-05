import React from 'react'
import classNames from 'classnames/bind'
import styles from './DefaultButton.module.scss'
const cx = classNames.bind(styles)

interface DefaultButton_Props{
    button_name: string,
    onClick: () => void,
}
export default function DefaultButton({button_name = "Click", onClick} : DefaultButton_Props) {
  return (
    <>
      <button onClick={onClick} className={cx('button-decor')}>{button_name}</button>
    </>
  )
}
