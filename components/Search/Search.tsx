import React from 'react'

import * as S from './Search.style'
import LiquidButton from '@components/LiquidButton'
import { Octokit } from '@octokit/rest'
import Issue from '@components/Issue/Issue'
import IssueLoader from '@components/IssueLoader/IssueLoader'

export type label =
  | string
  | {
      id?: number | undefined
      node_id?: string | undefined
      url?: string | undefined
      name?: string | undefined
      description?: string | null | undefined
      color?: string | null | undefined
      default?: boolean | undefined
    }

const Search: React.FC = () => {
  const octo = new Octokit({})

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [title, setTitle] = React.useState<string>()
  const [date, setDate] = React.useState<string>()
  const [author, setAuthor] = React.useState<string>()
  const [link, setLink] = React.useState<string>()
  const [authorLink, setAuthorLink] = React.useState<string>()
  const [number, setNumber] = React.useState<number>()
  const [tags, setTags] = React.useState<label[]>()
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [repoDetails, setRepoDetails] = React.useState([''])

  React.useEffect(() => {
    inputRef.current!.addEventListener('change', () => {
      inputRef.current!.value.startsWith('http')
        ? setRepoDetails(inputRef.current!.value.slice(19).split('/'))
        : setRepoDetails(inputRef.current!.value.split('/'))
    })
  }, [])

  const FetchIssues = () => {
    setLoading(true)
    setError(false)
    octo
      .paginate(octo.issues.listForRepo, {
        owner: repoDetails[0],
        repo: repoDetails[1],
      })
      .then(issues => {
        console.log(repoDetails)

        issues = issues.filter(el => !Boolean(el.pull_request))

        let issueNumbers = []

        for (let i = 0; i < issues.length; i++) {
          issueNumbers.push(issues[i].number)
        }

        const issueIndex = Math.floor(
          Math.random() * Math.floor(issueNumbers.length)
        )

        setTitle(issues[issueIndex].title)
        setDate(issues[issueIndex].created_at)
        setAuthor(issues[issueIndex].user?.login)
        setAuthorLink(issues[issueIndex].user?.html_url)
        setLink(issues[issueIndex].html_url)
        setNumber(issues[issueIndex].number)
        setTags(issues[issueIndex].labels)
        setLoading(false)

        setError(false)
      })
      .catch(err => setError(true))
  }

  return (
    <S.SearchContainer>
      <S.SearchInputContainer>
        <S.SearchInput
          placeholder='URL, or username/repo'
          spellCheck='false'
          ref={inputRef}
        />
        <S.SearchError>
          {error &&
            "Whoops! We couldn't find any issues for that repository. Double check the spelling!"}
        </S.SearchError>
        <LiquidButton GetIssues={FetchIssues} />
      </S.SearchInputContainer>
      {loading ? (
        !error && !tags && <IssueLoader />
      ) : (
        error || !issueVisible ? '' : (
        <Issue
          title={title!}
          date={date!}
          author={author!}
          authorURL={authorLink!}
          link={link!}
          number={number!}
          labels={tags!}
        />)
      )}
    </S.SearchContainer>
  )
}

export default Search
