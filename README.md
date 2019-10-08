# HertzScript Isolate
Enables parallel multitasking in V8 using HertzScript coroutines.

TODO: This is a draft, it must be improved.

# Project Synopsis

HertzScript Isolate is a JavaScript M:N threading system implemented on top of the HertzScript programming environment, and allows programs to execute concurrently and/or in parallel depending on the quantity of available processors. The main motivation of HertzScript Isolate is to generate a standard multi-CPU parallel computing system and library for JavaScript. HertzScript (Hz) is the foundational platform for this project, and is a concurrent programming environment which implements userspace green threads; in other words, it can compile current standard JavaScript source code to be fully re-entrant, and is able to execute code with a higher degree of concurrency in run-times that do not support it. The current reference implementation of Hz (written in JavaScript) is a source-to-source/transpiler compiler based on Babel.

The primary goal of Hz Isolate is to be able to analyze JavaScript source code both statically and dynamically to facilitate a parallel task scheduler, provide automatic parallelization, and provide an API of primitives to existing run-times that do not support parallelism.

# Use-Cases

Developers can create JavaScript applications which function similarly to those of Golang by linking the discrete components of their applications via channels, thereby allowing them to run concurrently and in parallel without any hassle or complicated interfaces. NodeJS and web browsers use a deferred work queue for concurrency by default, but it can often be insufficient for some systems as JavaScript is still executed in a single thread; we want to combine both operations by executing JavaScript in parallel with I/O throughput. Our main motivation is to allow existing code to be executed efficiently in FaaS (Function as a Service) environments or high intensity computation applications.

Some common use-cases of HertzScript Isolate are the following:

- Improving the default capabilities of HertzScript by providing parallel execution, thus allowing a real M:N threading model.
- Communicating Sequential Processes (like Golang).
- Concurrent and parallel execution of JavaScript programs.
- Calculating multiple Matrices across all available processors.
- Video game engines, as mixing I/O with concurrent/parallel programming can simplify the design of video games.
- Responsive (non-blocking) UX which runs independently of CPU-bound functions or underlying technology, as the event loop can never be blocked.

# Enabling Functionalities

## Dynamic Hooks

A feature of HertzScript which aids in parallel computing is that it dynamically implements multiple function call hooks at run-time; this property is very important and allows Hz to generate JavaScript source code that it is able to be executed, stopped, and paused/resumed arbitrarily. A hook is additional functionality applied statically to source code, or applied dynamically to a program that is already executing; for example a debugger like Counter Strike AMX-MOD (static) or GCC (dynamic). Hz is able to hook into all function calls by using its compiler to statically detour each step (function call) of the source code into Hz at run-time, thus making them available for dynamic hooks and extensions. By utilizing the hook/detour mechanisms in Hz, we can begin to implement new abstract features such as better stack traces, dynamic analysis, tail-call optimization, reflective meta-programming techniques, and automatic parallelization.

## V8 Isolates

Reference about the implementation in V8: https://stackoverflow.com/a/44359082

Latest improvements have enabled JavaScript to provide basic parallelism thanks to the V8 multiple-Isolate technique. V8 has an internal structure called Isolate which represents the context of executing JavaScript source code. In its current state, HertzScript effectively generates re-entrant code that can be used as green threads. For example, what the class Thread of CRuby (MRI) implements, but the implementation has some differences. The CRuby (MRI) implementation is very similar to CPython in many aspects but especially in regard to thread synchronization. Ruby and Python both use a common global mutex which prevents race conditions by blocking execution of their interpreters, as opposed to the Java Virtual Machine (JVM) which is designed to be non-blocking and atomic.

In the case of V8 we used to have similar limitations which have now been removed via the V8 multi-Isolate technique. Since version (TODO), V8 implemented support for multi-Isolate environments. This gives to us a better solution for parallel computing compared to Ruby and Python, but at the same time it gives us a very low level API which is difficult to use from the point of view of the user. HertzScript Isolate mixes HertzScript userspace green threads with the V8 multi-Isolate technique, allowing one JavaScript program to be executed by multiple processors simultaneously. An alternative to this is to make V8 completely atomic like the JVM, but this is not an option right now due to the current state of the art, so we provide an intermediate solution for JavaScript (and other languages) for achieving these capabilities.
