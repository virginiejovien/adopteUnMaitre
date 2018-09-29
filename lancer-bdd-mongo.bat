@echo off

start cmd /k C:\devjs\mongodb\server\bin\mongod.exe --dbpath=C:\Users\Virginie\Desktop\adopteunmaitre\data

pause

start cmd /k C:\devjs\mongodb\server\bin\mongo.exe