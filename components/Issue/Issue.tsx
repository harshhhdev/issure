import React from 'react'
import { Calendar, User } from 'react-feather'

import { label } from '@components/Search/Search'
import * as S from './Issue.style'

const Issue: React.FC<{
  title: string
  date: string
  author: string
  authorURL: string
  link: string
  number: number
  labels: label[]
}> = ({ title, date, author, authorURL, link, number, labels }) => {
  const unixDate = new Date(date)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const year = unixDate.getFullYear()
  const month = months[unixDate.getMonth()]
  const day = unixDate.getDate()
  const formattedDate = day + ' ' + month + ' ' + year

  return (
    <S.IssueBox>
      <S.IssueTitle title={title} href={link} target='_blank' rel='noreferrer'>
        #{number} {title.length > 30 ? title.slice(0, 30) + '...' : title}
      </S.IssueTitle>
      <S.IssueDescription>
        <Calendar /> Created on {formattedDate}
      </S.IssueDescription>
      <S.IssueDescription>
        <User /> Created by
        <a href={authorURL} target='_blank' rel='noreferrer'>
          {author}
        </a>
      </S.IssueDescription>
      <S.Labels>
        {labels.slice(0, 3).map((label: any, index) => (
          <S.Label
            key={index}
            href={label.url}
            target='_blank'
            rel='noreferrer'
            title={label.name}
          >
            {label.name.length > 12
              ? label.name.slice(0, 12) + '...'
              : label.name}
          </S.Label>
        ))}
      </S.Labels>
    </S.IssueBox>
  )
}

export default Issue
