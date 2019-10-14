import React from 'react'
import { Menu, Icon, Col, Row, Layout, Drawer } from 'antd'
import { NavLink } from 'react-router-dom'

import { LearnContent } from '../components/learn/LearnContent'

import * as actionCreators from '../redux/actions/index'
import { connect } from 'react-redux'
import { INode } from '../redux/types/learn'
import { CustomSpin } from '../components/Spin'
import { DesktopOnly } from '../components/Responsive'
import styled from 'styled-components'

const { SubMenu } = Menu
const { Content, Sider } = Layout

const responsive = `(max-width: 1020px)`

const DrawerMenu = styled.div`
  position: fixed;
  top: 144px;
  width: 41px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  display: none;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 0 4px 4px 0;

  @media ${responsive} {
    display: flex;
  }
`
interface ILearnState {
  visible: boolean
}

class Learn extends React.Component<any, ILearnState> {
  state = {
    visible: false
  }
  componentDidMount() {
    this.props.onInitialLoad(this.props.match.params.article_id)
  }

  onItemClick = (node: any) => {
    this.props.onChangeArticle(this.props.idMap.get(node.article_id))
  }

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const currentPath = this.props.match.url
    const nodes = this.props.menu
    const article_id = this.props.match.params.article_id

    return this.props.menuStatus !== 'SUCCESS' ? (
      <CustomSpin />
    ) : (
      <Layout>
        <DrawerMenu onClick={this.showDrawer}>
          <Icon type="menu" />
        </DrawerMenu>
        <Drawer
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ padding: '10px' }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[currentPath]}
            style={{ borderRight: 'none' }}
          >
            <Menu.Item key={'/learn'}>
              <NavLink to={'/learn'}>
                <Icon type="home" theme="filled" />
                Welcome!
              </NavLink>
            </Menu.Item>
            {nodes.map((node: INode) => {
              return node.type === 'section' ? (
                <SubMenu key={node.name} title={node.name}>
                  {node.articles!.map((sub_node: INode) => {
                    return (
                      <Menu.Item
                        key={'/learn/' + sub_node.article_id}
                        onClick={() => this.onItemClick(sub_node)}
                      >
                        <NavLink to={'/learn/' + sub_node.article_id}>
                          {sub_node.name}
                        </NavLink>
                      </Menu.Item>
                    )
                  })}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={'/learn/' + node.article_id}
                  onClick={() => this.onItemClick(node)}
                >
                  <NavLink to={'/learn/' + node.article_id}>
                    {node.name}
                  </NavLink>
                </Menu.Item>
              )
            })}
          </Menu>
        </Drawer>
        <DesktopOnly>
          <Sider width={325} style={{ backgroundColor: 'white' }}>
            <Menu theme="light" mode="inline" selectedKeys={[currentPath]}>
              <Menu.Item key={'/learn'}>
                <NavLink to={'/learn'}>
                  <Icon type="home" theme="filled" />
                  Welcome!
                </NavLink>
              </Menu.Item>
              {nodes.map((node: INode) => {
                return node.type === 'section' ? (
                  <SubMenu key={node.name} title={node.name}>
                    {node.articles!.map((sub_node: INode) => {
                      return (
                        <Menu.Item
                          key={'/learn/' + sub_node.article_id}
                          onClick={() => this.onItemClick(sub_node)}
                        >
                          <NavLink to={'/learn/' + sub_node.article_id}>
                            {sub_node.name}
                          </NavLink>
                        </Menu.Item>
                      )
                    })}
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key={'/learn/' + node.article_id}
                    onClick={() => this.onItemClick(node)}
                  >
                    <NavLink to={'/learn/' + node.article_id}>
                      {node.name}
                    </NavLink>
                  </Menu.Item>
                )
              })}
            </Menu>
          </Sider>
        </DesktopOnly>
        <Content>
          <Row>
            <Col lg={{ span: 16, offset: 4 }} xs={{ span: 18, offset: 3 }}>
              {article_id ? (
                <LearnContent
                  article_id={article_id}
                  currentContentStatus={this.props.currentContentStatus}
                  currentContent={this.props.currentContent}
                />
              ) : (
                <div>
                  <br />
                  <br />
                  Welcome to Programming.in.th Tutorials, a comprehensive
                  compilation of all the resources you need to succeed in
                  learning algorithms, data structures and competitive
                  programming!
                </div>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    menu: state.learn.menu,
    menuStatus: state.learn.menuStatus,
    idMap: state.learn.idMap,
    currentContent: state.learn.currentContent,
    currentContentStatus: state.learn.currentContentStatus
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onInitialLoad: (article_id: string) => {
      dispatch(actionCreators.loadMenu(article_id))
    },
    onChangeArticle: (newArticle: INode) => {
      dispatch(actionCreators.loadContent(newArticle.url!))
    }
  }
}

export const LearnPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Learn)
