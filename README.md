# 물류관리 샘플챗봇

# 개발방법

1. local에 서버시작.

2. 8004 포트 터널링. 0.0.0.0 으로 열리면 그대로 사용. 127로 열리면 프록시 사용.

3. goproxy 설치 및 8005포트 열기.
```
# curl -L https://raw.githubusercontent.com/snail007/goproxy/master/install_auto.sh | bash

# proxy tcp -p ":8002" -T tcp -P "127.0.0.1:8003"
```
