import classlist from 'classlist'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import EventPool from '../_utils/EventPool'
import ToggleNode from '../_utils/ToggleNode'
import ModalContent from './ModalContent'

const scrollbarWidth = (() => {
  const scrollDiv = document.createElement('div')
  const body = document.body

  scrollDiv.className = `${prefixCls}-modal__scrollbar-measure`
  body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  body.removeChild(scrollDiv)

  return scrollbarWidth
})()

class Modal extends Component {
  constructor (props) {
    super(props)
    this.closeCallbacks = new EventPool()
    this.state = {
      open: props.open || false
    }
  }

  componentWillReceiveProps (nextProps) {
    'open' in nextProps && this.setState({ open: nextProps.open })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !(this.state.open === nextState.open && nextState.open === false)
  }

  componentDidMount () {
    this.updateBodyState(this.state.open, false)
    if (this.state.open) {
      this.renderIntoDocument()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    this.updateBodyState(this.state.open, prevState.open)
    if (this.state.open) {
      this.renderIntoDocument()
    } else {
      prevState.open && this.toggleModal.close()
      const { modalContent } = this.context
      if (modalContent) {
        modalContent.goForward()
      }
    }
  }

  componentWillUnmount () {
    if (this.containerNode) {
      ReactDOM.unmountComponentAtNode(this.containerNode)
      document.body.removeChild(this.containerNode)
      // TODO 代码和updateBodyState重复，后期优化，有状态组件产生了副作用
      const body = document.body
      const bodyPaddingRight = parseInt(body.style.paddingRight, 10) || 0
      const _scrollbarWidth = body.scrollHeight > window.innerHeight ? scrollbarWidth : 0
      classlist(body).remove(`${prefixCls}-modal_open`)
      if (bodyPaddingRight) {
        body.style.paddingRight = bodyPaddingRight - _scrollbarWidth + 'px'
      } else {
        body.style.paddingRight = ''
      }
    }
  }

  updateBodyState (open, prevOpen) {
    if (this.context.modalContent) {
      return
    }
    const body = document.body
    const bodyPaddingRight = parseInt(body.style.paddingRight, 10) || 0
    const _scrollbarWidth = body.scrollHeight > window.innerHeight ? scrollbarWidth : 0
    if (open && !prevOpen) {
      classlist(body).add(`${prefixCls}-modal_open`)
      body.style.paddingRight = bodyPaddingRight + _scrollbarWidth + 'px'
    } else if (!open && prevOpen) {
      this.closeCallbacks.add(() => {
        classlist(body).remove(`${prefixCls}-modal_open`)
        if (bodyPaddingRight) {
          body.style.paddingRight = bodyPaddingRight - _scrollbarWidth + 'px'
        } else {
          body.style.paddingRight = ''
        }
      })
    }
  }

  /**
   * @public
   * @name this.refs.modal.open
   * @description 打开模态框
   */
  open () {
    this.setState({ open: true })
    this.props.onToggle && this.props.onToggle(true)
  }

  /**
   * @public
   * @name this.refs.modal.close
   * @param {function} [callback] 关闭后的回调，动画结束后执行
   * @description 关闭模态框
   */
  close = (callback = this.props.onClose) => {
    this.setState({ open: false })
    this.props.onToggle && this.props.onToggle(false)
    this.closeCallbacks.add(callback)
  }

  renderIntoDocument () {
    if (!this.containerNode) {
      this.containerNode = document.createElement('div')
      document.body.appendChild(this.containerNode)
    }
    const onRendered = () => {
      if (!this.toggleModal) {
        const node = ReactDOM.findDOMNode(this.content)
        this.toggleModal = new ToggleNode(node, `${prefixCls}-modal_open`)
        this.toggleModal.onClose = () => this.closeCallbacks.free()
      }
      this.toggleModal.open()
      const { modalContent } = this.context
      if (modalContent) {
        modalContent.backUp()
      }
    }
    this.renderIntoDocument = () => {
      const { open, onToggle, onClose, ...other } = this.props
      ReactDOM.render((
        <ModalContent
          ref={content => (this.content = content)}
          close={this.close}
          modal={this}
          {...other}
        />
      ), this.containerNode, onRendered)
    }
    this.renderIntoDocument()
  }

  render () {
    return null
  }
}

Modal.contextTypes = {
  modalContent: PropTypes.object
}

Modal.propTypes = {

  // 是否打开
  open: PropTypes.bool,

  // 切换 open 状态后的回调，参数为切换后的 open 状态，立刻执行，不会等到动画结束后
  onToggle: PropTypes.func,

  // 是否锁定，锁定后点击背景无法关闭
  lock: PropTypes.bool,

  // 关闭后的回调，动画结束后执行。如果 close 方法传入回调，则此属性不会触发
  onClose: PropTypes.func,

  // 尺寸，可选值：`sm`, `lg`, 默认中等尺寸
  size: PropTypes.oneOf(['sm', 'lg'])
}

export default Modal
