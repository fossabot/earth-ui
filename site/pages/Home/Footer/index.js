import React, { PureComponent } from 'react'
import './index.less'

class Footer extends PureComponent {
  render () {
    return (
      <footer className="container">
        <div className="first-line">
          <div className="left">
            <h2>About Earth-UI</h2>
            <div className="intro">
              A minimalism style ui component library based on React
            </div>
          </div>
          <div className="left">
            <h2>Alipay reward</h2>
            <div className="pay">
              <img src="/img/qrcode_alipay.jpg" alt="" />
            </div>
          </div>
          <div className="left">
            <h2>Wechat reward</h2>
            <div className="pay">
              <img src="/img/qrcode_wechat.jpg" alt="" />
            </div>
          </div>
          <div className="right">
            <h2>Help</h2>
            <div className="help">
              <div>
                <a href="https://github.com/cosmos-x/earth-ui">Github</a>
              </div>
              <div>
                <a href="https://github.com/cosmos-x/earth-ui/releases">
                  Release Note
                </a>
              </div>
              <div>
                <a href="https://github.com/cosmos-x/earth-ui/issues/new">
                  Bug Report
                </a>
              </div>
              <div>
                <a href="https://g-explorer.slack.com">Slack Chat</a>
              </div>
            </div>
          </div>
        </div>
        <div className="second-line">
          <div className="left">
            <span className="footer__second-line-left-logo">EARTHUi</span>
          </div>
          <div className="right">
            <span>SU ICP NO.15056713</span>
            <span>© Kimi Gao</span>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
