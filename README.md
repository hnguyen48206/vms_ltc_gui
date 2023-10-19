<mark>************* Môi trường dev cần cài đặt:</mark>

+ Windows:

1. OS 64 bit từ win 7 trở lên.
2. Cài đặt VLC mới nhất.
3. Add PATH VLC vào biến môi trường của Windows.
4. Cài đặt NodeJs version 14.*

+ Linux:

1. OS Ubuntu 64 bit bản 14 hoặc 16 LTS.
2. Cài đặt VLC mới nhất bằng lệnh: sudo apt get vlc
3. Cài đặt libde265 bằng các lệnh theo thứ tự: 

    sudo apt-add-repository ppa:strukturag/libde265  
    sudo apt-get update  
    sudo apt-get install vlc-plugin-libde265  

4. Cài đặt thêm gói extras của ubuntu: sudo apt install ubuntu-restricted-extras
5. Cài đặt NodeJs version 14.*

(*) Nếu dev trên máy ảo Linux thì phải enable GPU render trong setting của máy ảo và chạy lệnh:
export SVGA_VGPU10=0

<mark>************* Các bước cần làm sau khi pull src về:</mark>

1. Remove file package-lock.json đi.

2. Trong file package.json, bỏ đi 2 thư viện là nw (trong phần devDependencies) và webchimejs (trong phần dependencies).

3. Chạy lệnh 'npm i'

4. Sau khi tất cả thư viện đã cài đặt xong thì chạy 2 lệnh sau:

npm install webchimera.js@0.2.7 --ignore-scripts  
npm install nw@0.18.7 --save-dev --nwjs_build_type=sdk

(*) Đối với linux thì đổi phiên bản của nw thành 0.18.1

5. Download file thư viện sau:

+ Với Windows: https://drive.google.com/file/d/1CDpNV11ev5t5fhxpp_d0Bnl0jFDFbD4o/view?usp=sharing
+ Với Linux: https://drive.google.com/file/d/1b0wY9Ok-5ovPG96VAoUrGeYcnJ-GvSnb/view?usp=sharing

Vào thư mục node_modules\webchimera.js trong project và tạo 1 folder mới tên Release, sau đó bỏ file vừa download vào trong.

<mark>************* Các lệnh cơ bản để chạy project:</mark>

+ Chạy khi dev: npm start
+ Chạy để build ra app: npm run build:win hoặc npm run build:linux tùy OS. Thời gian build từ 15-20p.

