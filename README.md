# wechaty-speaker-mention

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

使用wechaty来实现当微信群中有人在指定段时间内连续发送多条记录就提醒对方不要过度发言。

## require

    node version >=10

## env

    ECHATY_PUPPET_PADPLUS_TOKEN=XXX  ##wechaty提供的token，如果是通过web接口的话无需该环境变量
    WECHATY_PUPPET=wechaty-puppet-padplus ##如果是通过web接口的话无需该环境变量
    TIME_LIMIT=1800000 ## 时间限定范围，单位ms 默认为半小时
    SPEAK_LIMIT=3   ## 允许发言次数，超过该次数则提醒用户不要过度发言，默认为3
    ROOM=XXXXX ## 生效的群id，首次使用不知道群id，不需填写，启动后在该群有消息的时候 日志中会有 类似 "群信息:Room<群名称>,<XXXXXXX@chatroom>" ，选择需要的群名，把对应的群id（XXXXXXX@chatroom）配置到该变量然后重启
    MENTION_TEXT=不要过度发言  ## 自定义提醒的文本 默认为 `请${ms(timeLimit)}内不要超过${speakLimit}次发消息哦`}`

## run
    - git clone git@github.com:chianquan/wechaty-speaker-mention.git
    - npm install
    - WECHATY_PUPPET_PADPLUS_TOKEN=XXX WECHATY_PUPPET=wechaty-puppet-padplus npm start


## licence
MIT
