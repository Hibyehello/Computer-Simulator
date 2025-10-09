import sys
from livereload import Server

def alert():
  print("Change Detected... Reloading!")

def start(host="0.0.0.0", port="5500"):
  server = Server()
  server.watch("Chromebook/", alert)
  server.watch("Chromebook/Desktop/", alert)

  server.serve(host="192.168.1.119", port="5500")

if "__name__" == "__main__":
  if len(sys.argv) == 3:
    start(sys.argv[1], sys.argv[2])
  elif len(sys.argv) == 2:
    start(sys.argv[1])
  else:
    start()
    