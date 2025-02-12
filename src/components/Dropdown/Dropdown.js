import PropTypes from 'prop-types'
import React, { Component } from 'react'
import controlledPropValidator from '../_utils/propValidator/controlled'
import Popover from '../Popover'
import DropdownMenu from './DropdownMenu'
import DropdownToggle from './DropdownToggle'

class Dropdown extends Component {
  constructor (props) {
    super()
    this.state = {
      open: props.open || false
    }
  }

  componentWillReceiveProps (nextProps) {
    'open' in nextProps && this.setState({ open: nextProps.open })
  }

  /**
   * @public
   * @name this.refs.dropdown.open
   * @description 展开
   */
  open () {
    this.setState({ open: true })
  }

  /**
   * @public
   * @name this.refs.dropdown.close
   * @description 收起
   */
  close () {
    this.setState({ open: false })
  }

  handleToggle = open => {
    this.setState({ open })
    this.props.onToggle && this.props.onToggle(open)
  }

  render () {
    const { children, disabled, aligned } = this.props
    const { open } = this.state

    let toggle, menu
    React.Children.forEach(children, child => {
      if (child.type === DropdownToggle) {
        toggle = child
      } else if (child.type === DropdownMenu) {
        menu = child
      }
    })

    const { right, ...menuProps } = menu.props
    if (right) {
      menuProps.align = 'right'
    }

    return (
      <Popover
        triggerMode="click"
        open={open}
        onToggle={this.handleToggle}
        content={menuProps.children}
        disabled={disabled}
        aligned={aligned}
        {...menuProps}
      >
        {React.cloneElement(toggle, { open })}
      </Popover>
    )
  }
}

Dropdown.propTypes = {
  children: PropTypes.node,

  // 是否展开
  open: controlledPropValidator(PropTypes.bool, 'onToggle'),

  // 切换 open 状态后的回调，参数为切换后的 open 状态
  onToggle: PropTypes.func,

  // 是否禁用
  disabled: PropTypes.bool,

  // DropdownToggle 与 DropdownMenu 宽度相同
  aligned: PropTypes.bool
}

export default Dropdown
