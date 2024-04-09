insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (21,1,1,1,'Disabling SELinux on CentOS 6','nano /etc/selinux/config\r\n# change SELINUX=enforcing to SELINUX=disabled\r\necho 0 > /selinux/enforce',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (22,1,1,1,'Get Uptime on Linux','uptime',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (3,1,1,1,'Install Git 2.6.2 on CentOS 6/7','sudo yum groupinstall -y \'development tools\'\r\nsudo yum install -y wget curl-devel expat-devel gettext-devel openssl-devel perl-devel zlib-devel\r\nwget https://cmd.bri.io/static/deps/3/git-2.6.2.tar.gz\r\ntar -zxf git-2.6.2.tar.gz\r\ncd git-2.6.2\r\nmake configure\r\n./configure --prefix=/usr\r\nmake all\r\nsudo make install',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (4,1,1,1,'Install Ruby 2.1.0 on CentOS 6/7','sudo yum groupinstall -y \'development tools\'\r\ngpg2 --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3\r\ncurl -L get.rvm.io | bash -s stable\r\nsource /etc/profile.d/rvm.sh\r\nrvm reload\r\nrvm install 2.1.0',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (5,1,1,1,'Burn DVD from the command line','wodim -eject -tao  speed=2 dev=/dev/sr0 -v -data isoname.iso',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (6,1,1,1,'Generate Private Key and CSR on CentOS 6/7','sudo yum install -y openssl\r\nopenssl genrsa -out server.key 2048\r\nopenssl req -new -sha256 -key server.key -out server.csr',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (7,1,1,1,'Resize Google Compute Engine VM Boot Disk','fdisk -l\r\n# take note of the starting sector\r\n\r\nfdisk /dev/sda\r\n# hit d to delete the partition\r\n# hit n for new partition\r\n# hit p for primary\r\n# hit 1 for partition number\r\n# type the starting sector and hit enter\r\n# hit enter to accept the end sector\r\n# hit w to write the partition table\r\n\r\nresize2fs /dev/sda1',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (8,1,1,1,'Create combined SSL chain file','# order matters\r\ncat yourcert.crt intermediate.crt root.crt yourkey.key > combined.pem',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (9,1,1,1,'Create and use a LUKS Volume','# create luks\r\ndd if=/dev/urandom of=/home/brian/file bs=1M count=512\r\nsudo cryptsetup -y luksFormat /home/brian/file\r\nsudo cryptsetup luksOpen /home/brian/file volume_name\r\nsudo mkfs.ext4 /dev/mapper/volume_name\r\n\r\n# mount\r\nsudo cryptsetup luksOpen /home/brian/file volume_name\r\nsudo mount /dev/mapper/volume_name /mount/point\r\n\r\n# close\r\nsudo umount /dev/mapper/volume_name\r\nsudo cryptsetup luksClose volume_name',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (10,1,1,1,'Install Python 2.7.3 on CentOS 6/7','sudo yum groupinstall -y \'development tools\'\r\nwget http://python.org/ftp/python/2.7.6/Python-2.7.6.tar.xz\r\nxz -d Python-2.7.6.tar.xz\r\ntar -xvf Python-2.7.6.tar\r\nrm -f Python-2.7.6.tar\r\ncd Python-2.7.6\r\n./configure\r\nmake && make altinstall\r\ncd ..',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (11,1,1,1,'Install Latest bmig on CentOS 6/7','sudo yum install -y gcc mysql-devel json-c-devel\r\ngit clone https://github.com/ebrian/bmig\r\ncd bmig\r\nmake\r\nsudo make install',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (12,1,1,1,'Install Latest bmig on Ubuntu','sudo apt-get install build-essential pkg-config git gcc libmysqlclient-dev libjson0-dev\r\ngit clone https://github.com/ebrian/bmig\r\ncd bmig\r\nmake\r\nsudo make install',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (13,1,1,1,'Install GCC 4.8.x on CentOS 6/7','wget http://people.centos.org/tru/devtools-2/devtools-2.repo -O /etc/yum.repos.d/devtools-2.repo\r\nyum install devtoolset-2-gcc devtoolset-2-gcc-c++ devtoolset-2-binutils\r\nscl enable devtoolset-2 bash',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (14,1,1,1,'Install Node 4.2.1 on CentOS 6/7','wget https://nodejs.org/dist/v4.2.1/node-v4.2.1-linux-x64.tar.gz\r\ntar -xzzvf node-v4.2.1-linux-x64.tar.gz\r\nrm -f node-v4.2.1-linux-x64.tar.gz\r\nmv node-v4.2.1-linux-x64 node4',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (15,1,1,1,'Install MySQL 5.5 on CentOS 6','rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm\r\nyum install -y mysql.`uname -i` yum-plugin-replace\r\nyum replace mysql --replace-with mysql55w\r\nyum install -y mysql55w mysql55w-server',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (16,1,1,1,'MySQL Table to CSV','select *\r\n  from table\r\n  into outfile \'/tmp/file.csv\'\r\n  fields terminated by \',\' optionally enclosed by \'\"\'\r\n  lines terminated by \'\\n\';',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (17,1,1,1,'Install Node 4.2.1 on Raspberry PI 2 B+','wget https://nodejs.org/dist/v4.2.1/node-v4.2.1-linux-armv6l.tar.gz\r\ntar -xzzvf node-v4.2.1-linux-armv6l.tar.gz\r\nrm -f node-v4.2.1-linux-armv6l.tar.gz\r\nmv node-v4.2.1-linux-armv6l node4\r\nln -s /root/node4/bin/node /usr/bin/node\r\nln -s /root/node4/bin/npm /usr/bin/npm',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (19,1,1,1,'TAR and GZip to GPG on the fly','# encrypt\r\nexport GPG_TTY=$(tty)\r\ntar zcf - whatever_folder | gpg --symmetric --cipher-algo aes256 -o whatever.gpg\r\n\r\n# decrypt\r\nexport GPG_TTY=$(tty)\r\ngpg -d whatever.gpg | tar xzf -',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (20,1,1,1,'Compress, Encrypt with GPG, and Split','# construct\r\nexport GPG_TTY=$(tty)\r\ntoday=$(date +%Y%m%d)\r\ntar zcf - folder1 folder2 folder3 \\\r\n    | gpg --symmetric --cipher-algo aes256 -o - \\\r\n    | split -b 2G -d -a 3 - backup.$today.gpg.\r\n\r\n# deconstruct\r\nexport GPG_TTY=$(tty)\r\ncat backup.20160607.gpg.* \\\r\n    | gpg -d -o - \\\r\n    | tar xzf -',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (23,1,1,1,'Install Node 6 on Centos 6/7','wget https://nodejs.org/dist/v6.3.0/node-v6.3.0-linux-x64.tar.gz\r\ntar -xzzvf node-v6.3.0-linux-x64.tar.gz\r\nrm -f node-v6.3.0-linux-x64.tar.gz\r\nmv node-v6.3.0-linux-x64 node6',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (24,1,1,1,'Wipe Drive Linux','# yes this is secure, stop being paranoid\r\n# https://digital-forensics.sans.org/blog/2009/01/15/overwriting-hard-drive-data/\r\n\r\ndd if=/dev/zero of=/dev/your_device bs=1M',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (26,1,1,1,'Create self-signed SSL Certificate','openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days XXX -nodes',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (27,1,1,1,'Bulk Crop Images','for f in *.jpg; do\r\n  convert $f -trim $f\r\ndone',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (28,1,1,1,'CentOS 6 TTY Auto Login','# open config\r\nnano /etc/init/tty.conf\r\n\r\n# replace this\r\nexec /sbin/mingetty $TTY\r\n\r\n# with this (replace username)\r\nexec /sbin/mingetty --autologin username $TTY',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (29,1,1,1,'CentOS 6 No TTY Screensaver','# open config\r\nnano /etc/rc.d/rc.local\r\n\r\n# add this line at the bottom\r\nsetterm -blank 0',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (30,1,1,1,'CentOS 6 SELinux Allow FTP Directory Change','setsebool -P ftp_home_dir=1',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (31,1,1,1,'CentOS Google Cloud SDK Working With Python 2.7','# get pip2.7\r\nwget https://bootstrap.pypa.io/get-pip.py\r\npython2.7 get-pip.py\r\n\r\n# install the gcloud module\r\npip2.7 install google_compute_engine\r\n\r\n# add to .bashrc\r\nexport CLOUDSDK_PYTHON=/usr/local/bin/python2.7',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (33,1,1,1,'Convert Bare Git Repo to Normal Repo','mkdir .git\r\nmv branches/ config description HEAD hooks/ info/ objects/ refs/ .git\r\ngit config --local --bool core.bare false\r\ngit checkout master\r\ngit reset --hard',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (34,1,1,1,'Linux Primitive UDP Hole Punching','# from machine1 (1.2.3.4)\r\n# punch a hole in the firewall\r\nhping2 -c 1 -2 -s 14141 -p 53 5.6.7.8\r\n\r\n# from machine1 (firewalled)\r\n# listen for connections on 1.2.3.4:14141\r\nnc -u -l -p 14141\r\n\r\n# from machine2 (5.6.7.8)\r\n# send a message to 1.2.3.4:14141 from 5.6.7.8:53\r\necho \'test\' | nc -p 53 -u 1.2.3.4 14141',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (35,1,1,1,'Install Python 3.4.5 on CentOS 6/7','sudo yum groupinstall -y \'development tools\'\r\nwget http://python.org/ftp/python/3.4.5/Python-3.4.5.tar.xz\r\nxz -d Python-3.4.5.tar.xz\r\ntar -xvf Python-3.4.5.tar\r\nrm -f Python-3.4.5.tar\r\ncd Python-3.4.5\r\n./configure\r\nmake && make altinstall\r\ncd ..',now());
insert into cli_scripts (cli_script_id, user_id, is_public, is_safe, title, content, created_at) values (36,1,1,1,'Install Latest Docker & Compose on CentOS 6/7','# Docker\r\nsudo yum install -y yum-utils device-mapper-persistent-data lvm2\r\nsudo yum-config-manager -y --add-repo https://download.docker.com/linux/centos/docker-ce.repo\r\nsudo yum install -y docker-ce\r\nsudo usermod -aG docker $(whoami)\r\nsudo systemctl enable docker.service\r\nsudo systemctl start docker.service\r\n\r\n# Docker Compose\r\nsudo yum install -y epel-release\r\nsudo yum install -y python-pip\r\nsudo pip install docker-compose\r\nsudo yum upgrade -y python*',now());
