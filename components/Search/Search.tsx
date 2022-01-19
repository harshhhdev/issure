import React from 'react'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import ReactLoading from 'react-loading'

import * as S from './Search.style'
import LiquidButton from '@components/LiquidButton'
import { Octokit } from '@octokit/rest'
import Issue from '@components/Issue/Issue'
import { Label } from '@components/Issue/Issue'

const Search: React.FC = () => {
  const octo = new Octokit({})

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [title, setTitle] = React.useState<string>()
  const [date, setDate] = React.useState<string>()
  const [author, setAuthor] = React.useState<string>()
  const [link, setLink] = React.useState<string>()
  const [authorLink, setAuthorLink] = React.useState<string>()
  const [number, setNumber] = React.useState<number>()
  const [tags, setTags] = React.useState<Label[]>()
  const [loading, setLoading] = React.useState(false)

  const [repoDetails, setRepoDetails] = React.useState([''])

  React.useEffect(() => {
    inputRef.current!.addEventListener('change', () => {
      inputRef.current!.value.startsWith('http')
        ? setRepoDetails(inputRef.current!.value.slice(19).split('/'))
        : setRepoDetails(inputRef.current!.value.split('/'))
    })
  }, [])

  const ErrorMsg = (msg: string) => {
    toast.error(msg, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  const FetchIssues = () => {
    setLoading(true)

    octo
      .paginate(octo.issues.listForRepo, {
        owner: repoDetails[0],
        repo: repoDetails[1],
      })
      .then(issues => {
        console.log(repoDetails)

        issues = issues.filter(el => !Boolean(el.pull_request))

        let issueNumbers = []

        for (let i = 0; i < issues.length; i++)
          issueNumbers.push(issues[i].number)

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
      })
      .catch(err => {
        console.log(err)
        ErrorMsg("Whoops! Can't fetch issues")
        setLoading(false)
      })
  }

  return (
    <S.SearchContainer>
      <S.SearchInputContainer>
        <S.SearchInput
          placeholder='URL, or username/repo'
          spellCheck='false'
          ref={inputRef}
        />
        <LiquidButton GetIssues={FetchIssues} />
      </S.SearchInputContainer>
      {loading ? (
        <ReactLoading type='spin' color='#275efe' />
      ) : (
        tags !== undefined && (
          <Issue
            title={title!}
            date={date!}
            author={author!}
            authorURL={authorLink!}
            link={link!}
            number={number!}
            labels={tags!}
          />
        )
      )}
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </S.SearchContainer>
  )
}

export default Search
