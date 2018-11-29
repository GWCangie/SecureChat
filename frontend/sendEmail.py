'''
http://naelshiab.com/tutorial-send-email-python/
'''

import smtplib
import random
'''import hashlib

''''''p = input("Enter the password >>")
hashpass = hashlib.md5(p.encode('utf8')).hexdigest()
print(hashpass)
''''''
'''
''''''
'''with open('password.txt') as f:
    credentials = [x.strip().split(':') for x in f.readlines()]

for username,password in credentials:
    print (username)
    print (password)
'''

#for x in range(10):
num = random.randint(1,101)

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login("noreply.2fa.aas@gmail.com", "security@12")

msg = "this is test message from our 2fa!your code is " + str(num)
server.sendmail("noreply.2fa.aas@gmail.com", "sss17d@my.fsu.edu", msg)
print("shim")
server.quit()
