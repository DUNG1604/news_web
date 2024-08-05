1. Giới thiệu
- web đọc báo với chức năng thêm sửa xóa bài viết, tìm kiếm và đọc báo và đếm số view của mỗi bài
2. Công nghệ sử dụng
- Express, ejs, mySQL
3. Cách cài đặt và run
- Cài các gói thư viện cần thiết
> npm install
- Tạo file .env
````
CONFIG_FIREBASE = "../../ce-web-8212b-firebase-adminsdk-wo21q-1c7912ffdb.json"
````
- Tạo 1 file cùng cấp với package.json
>ce-web-8212b-firebase-adminsdk-wo21q-1c7912ffdb.json
````
{
  "type": "service_account",
  "project_id": "ce-web-8212b",
  "private_key_id": "1c7912ffdbefd3102c2fa3a1e603622da095565d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDTQeV9xEbMcGQA\niw09XmmwaLftEWrPZKOeqUVdbUVPfHsh8OoXnb4zw4s8bWgNAL3fieJHIRh4p4p+\n/GaAN9j6Js5gQO7RvnC9PLt+CKLy+VhGvX+YwLLh80oXIBMNFiy6eHNBKGwUDBDD\n8JdIx4KgHDshNaslioUY8y7GJzth/3Nec7lmBpBrg1FpQNsD5GLIAORfNK/ZQNWG\nD+IFPB1n49YIwNIA5HEFbi47A58DLy46uoOF2bNx+RUlIxM6I1fQoTsX11hqmyKw\nxcs2m5ozzAoNM+KVAP+LJpRWyovTfbiPJ9eWiADBzzeLStlLVTBWUPWAO5ZzUd9X\nv5sMicqJAgMBAAECggEAGNnDUnJMhr+Az/yLc+jfg2AqJKG8IAXdZmxQi88vDEzf\nGizCCMGmTmYGArd2+jKYY0uPueDHhWfl946eyx3msPRwKevxe+xMTEJw5sBC1NSm\ngPnJIPGoCULKeCJug0dUvyGsoyFLZ2dM8JOkZCwN7mIrxXoP9iRPiFIQ8j/KsTn5\n1DzZuNwZAJPQgu9VFR+rFff/fFZGCIYPvss4Uma2jyCh5aCmc1durSE5TIq9ICHg\nXGdw2/1hHJYHMJIj9wpyrmQJbVj19vqA/jSx2RyPNaLHQHKtFQI3fgivhV9/lR25\nKTkTBs+ZoDhAFILBAImWWPKBMTht3C7IstmkqhspYQKBgQD8scjg8hJKDuTVpnxz\n7qnVXAunNrIKZEY0vwXD0v3x+es8H60ejU0Ba1yTvfzijxZ7Df34fl6IUXuoQVgZ\n+4/nWIH++9XSqSLxDSmTBycGXe8BpWcgQWROCuXK7fHleCBBf3dzHt02uv5rUmzo\nTeruty/tmjsmoUkbVzTmkb1OEQKBgQDWBVk/0aUhgTG4P0PRGwgWb92DnLFKJzJ0\n2YDx4s+VdMFrPOXW929ay7EBz55rZltpp1wComQ6OpgdUIjMqIAbBmf7AL0QgRt7\nNdJ2CiJJ3FKSfzrMHdLajY4ISwjAXuQ3tnIyLfGWmn2axtkxPmoeeJKNW47qnZ7n\n9e/+Ze8c+QKBgBkxiHuU5unnTj1W2fWdB+WzxZ2oQFv032MG4IZDlPn5FtDpv5La\nN6E6mQJJ4NqdtXoTTQznXHlu1ktSKHx+rjw8gMlxRkI4hrlNvKViAywJVXjuireW\njW+SepKe4o0kSuL82GXr39ZDEnaUwzLuAcxHC0o/JEKXtfg525ZZVWxhAoGALDDW\niNLk4dInTf/iJN8MAHYAqxhDkygcxvvSIB/Q9O8ysM3WN1jH6Vt9pP4Vm996qIoh\n+XlGcK+AkSz70iZIrUvZVH6Gi03dOseWOUFGazHO6ujSXysZSn9IAHZdzDrLrKVD\nVxEdfRdRMBA28HAOwVPsDrwE+nSpRwQFFeY+RSECgYAsVIxfsVH6pXHxHmEkbUO5\n+LCzGwt5eWUJgs2gGxENzpu5MDMyMM+jjOQvw3ln2xHjeLaRs2mnvBUZVQ5Se7Pt\nwcTXsC10l27JeGQ3kerdQVLKpMc41cbPkwvm/Yeqny8D87sJuch3EA1nEl9e1z6E\nen5RhltLQ1hsFCapop2oyA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-wo21q@ce-web-8212b.iam.gserviceaccount.com",
  "client_id": "108182300415014716774",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wo21q%40ce-web-8212b.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
````

- Chạy dự án
> nodemon
- Truy cập địa chỉ
> http://localhost:8017/
- Thêm acc admin trong db với role admin
