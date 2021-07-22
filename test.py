from datetime import datetime, timedelta
import requests
import zipfile


def download_url(url, save_path, chunk_size=128):
    r = requests.get(url, stream=True)
    with open(save_path, 'wb') as fd:
        for chunk in r.iter_content(chunk_size=chunk_size):
            fd.write(chunk)


# YYYYDDMM 형태로 어제 날짜 가져오기
yesterday = (datetime.now() - timedelta(days=2)).strftime("%Y%m%d")

print(yesterday)

save_path = f'./ext_sources/{yesterday}_update'
unzip_path = f'./ext_sources'

url = f"https://www.juso.go.kr/dn.do?reqType=DC&stdde={yesterday}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료"

# 변경분.zip 다운로드
download_url(url, save_path=save_path)

# unzip
with zipfile.ZipFile(save_path, 'r') as zip_ref:
    zip_ref.extractall(unzip_path)

