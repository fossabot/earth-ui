import React from 'react'
import { BackToTop } from 'earth-ui'
import Markdown from 'widgets/Markdown'
import html from '../../../CHANGELOG.md'
import { backToTop } from '../config'
import './index.less'

export default () => {
  return (
    <div className="changelog">
      {/* <Center> */}
      <Markdown html={html} />
      {/* </Center> */}
      <BackToTop {...backToTop} />
    </div>
  )
}
