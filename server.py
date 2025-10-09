from livereload import Server

server = Server()

def alert():
  print("Change Detected... Reloading!")

server.watch("Chromebook/", alert)

server.serve()