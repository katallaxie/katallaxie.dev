---
title: "The State of Go Plugins"
date: "2021-03-24"
draft: false
tags: ["go"]
---

[Terraform](https://www.terraform.io/), [Protocol Buffers](https://developers.google.com/protocol-buffers), [Waypoint](https://www.waypointproject.io/) or [Traefik](https://traefik.io/) have build a flourishing ecosystem by using the [Go](https://golang.org/) programming language and providing pluggable interfaces. But, not all pluggable interfaces in Go are created equal. There is more than one solution to the problem.

The problem they all try to solve is, that Go is a statically typed, compiled programming language. Thus, executing and interacting with code beyond the build phase of a Go program is hard. The progress of the standard library [plugin](https://golang.org/pkg/plugin/) package has also been very slow in recent years.

These are the common solutions to the problem out in the wild.

1. Client-server
2. Stdin to Stdout
3. Dynamic interpretation
4. Dynamic libraries with symbol resolution

## Client-Server

This is perhaps the most common approach to pluggable interfaces in Go. [Terraform](https://www.terraform.io/) or [Waypoint](https://www.waypointproject.io/) use this approach. How does this works?

Plugins are standalone Go programs (executables) that the main program executes. The main program runs a server that the plugin can connect to when run. The connection information are passed to the plugin as parameters or environment variables. Client and server commonly communicate via [gRPC](https://grpc.io/). Which allows for efficient communication, sharing the used interface and code generate client and server boilerplate.

The client-server communication via HTTP/2 has an impact on performance. If you want to build a pluggable program serving requests to anything on the internet it may increased response times by anything between `30-100ms`.

## Stdin to Stdout

The difference to the client-server solution is subtile when it comes to the details in implementation. [protoc-gen-go](https://github.com/golang/protobuf/tree/master/protoc-gen-go) and other plugins in the [Protocol Buffers](https://developers.google.com/protocol-buffers) ecosystem use this approach.

Plugins are again executables that the main program runs. But in contrast to the client-server communication via [gRPC](https://grpc.io/) the main program and the plugin communicate via the standard OS streams `stdin` / `stdout` with each other. In order to standardize the communication,  many of the programs use [Protocol Buffers](https://developers.google.com/protocol-buffers).

## Dynamic interpretation

The previous solutions have a performance penalty when it comes to transport information. [Traefik](https://traefik.io/) and other programs which are sensitive to response times pursue a different approach.

They dynamically load, interpret and execute Go code. The folks at [Traefik Labs](https://traefik.io) have created [Yaegi](https://github.com/traefik/yaegi) to do this. This allows for calling into the plugin code by using an [interface](https://gobyexample.com/interfaces) and a bit of [reflection](https://blog.golang.org/laws-of-reflection) magic of the runtime. Because the code is loaded and interpreted only once the performance penalty is only a the startup. But, it increases the complexity.

## Dynamic libraries with symbol resolution

The supported for plugins in the standard library started in `Go1.8`. Plugins ought to be shared objects (`.so`) that can build with [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) symbols that can be dynamically loaded at runtime. However, the progress has been fairly limited. Currently plugins are only supported on Linux, FreeBSD, and macOS. There are many issues with sharing modules in the plugin and the main program. Beyond some examples the use of this solution has been fairly limited.
