#include <napi.h>
#include <windows.h>
#include <thread>
#include <iostream>

Napi::ThreadSafeFunction tsfn;

void KeyListener() {
    while (true) {
        if (GetAsyncKeyState(VK_CONTROL) & 0x8000) {
            tsfn.BlockingCall([](Napi::Env env, Napi::Function jsCallback) {
                jsCallback.Call({ Napi::String::New(env, "Control Key") });
            });
            Sleep(100);
        }
        if (GetAsyncKeyState(VK_RETURN) & 0x8000) {
            tsfn.BlockingCall([](Napi::Env env, Napi::Function jsCallback) {
                jsCallback.Call({ Napi::String::New(env, "Enter Key") });
            });
            Sleep(100);
        }
        Sleep(10);
    }
}

void ListenForKeyPress(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Function callback = info[0].As<Napi::Function>();
    tsfn = Napi::ThreadSafeFunction::New(env, callback, "KeyPressCallback", 0, 1);

    std::thread(KeyListener).detach();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "listenForKeyPress"), Napi::Function::New(env, ListenForKeyPress));
    return exports;
}

NODE_API_MODULE(addon, Init)
