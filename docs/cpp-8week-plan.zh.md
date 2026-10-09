# C++ 8 周进阶计划：从类与对象到现代 C++

> **学习目标**：用 8 周时间补齐面向对象、资源管理、STL、模板与现代 C++ 的核心能力，能独立写出结构清晰、异常安全的多文件 C++17 程序。
> 
> **起点**：有基础：已掌握 class 之前的内容（变量、类型、控制流、函数、数组、指针与引用、字符串、结构体）
> **建议投入**：每天 90 分钟（工作日 60~90 分钟，周六 120 分钟项目日，周日 30 分钟回顾）
> **环境与教材**：Visual Studio 2022 或 VS Code + MinGW-w64 GCC（C++17）；主要教材《C++ Primer（第 5 版）》，查漏补缺用 cppreference。

全计划共 **8 周 / 56 天 / 104 道课后题**。

## 总览

| 周 | 主题 | 目标 | 天数 | 题目 |
| --- | --- | --- | --- | --- |
| 第 1 周 | 类与对象基础 | 从 struct 过渡到 class：用封装和访问控制保护数据，写出构造、析构、const 成员函数、static 成员都正确的类，并能解释编译器在每个环节替你生成了什么。 | 7 | 14 |
| 第 2 周 | 拷贝控制与运算符重载 | 掌握对象「怎么被复制、怎么被移动、怎么参与运算」：写出正确的三法则类，区分深浅拷贝，理解 std::move 偷资源的机制，并能让自定义类型像内置类型一样参与 + - == << += 与下标访问。 | 7 | 13 |
| 第 3 周 | 继承与多态 | 从「复制粘贴代码」升级到「通过接口编程」：能用继承表达 is-a 关系，理解动态绑定发生的确切条件，写出带虚析构的抽象基类，并在需要时用 RTTI 安全地识别真实类型。 | 7 | 13 |
| 第 4 周 | 资源管理与异常 | 把「资源」和「错误」都变成对象能表达的东西：用 RAII 让释放与作用域绑定，用异常把错误从深处传到能处理的地方，用智能指针表达所有权，并在设计上优先选择组合而不是继承。 | 7 | 12 |
| 第 5 周 | STL 容器与迭代器 | 掌握常用标准库容器的接口与复杂度直觉，能按访问模式选择容器，并说清迭代器类别与失效规则。 | 7 | 13 |
| 第 6 周 | STL 算法与函数式写法 | 把「手写 for 循环」替换为标准算法 + lambda，掌握排序、查找、改写、累积四类算法的用法与陷阱。 | 7 | 13 |
| 第 7 周 | 模板与泛型编程 | 能写出可复用的函数模板与类模板，理解特化、可变参数、非类型参数，并会用 constexpr 与 concepts 表达约束。 | 7 | 13 |
| 第 8 周 | 现代 C++ 综合实战 | 掌握移动语义、完美转发与 C++17 值语义工具，写出一个带并发入门知识、含文件持久化的命令行通讯录项目。 | 7 | 13 |

---

## 第 1 周 · 类与对象基础

**本周目标**：从 struct 过渡到 class：用封装和访问控制保护数据，写出构造、析构、const 成员函数、static 成员都正确的类，并能解释编译器在每个环节替你生成了什么。

### 周一 · class 与封装：把数据关进盒子里 —— 学习 / 1.5 小时

**今天学什么**

- class 与 struct 的唯一语言级差别是默认访问级别：struct 成员默认 public，class 默认 private，所以「用 class 表达有不变量的抽象、用 struct 表达纯数据聚合」是社区惯例而非语法要求。
- 封装的价值是让不变量有唯一守门人：把数据成员设为 private 后，所有修改都必须经过成员函数，你才有机会在函数里做校验并决定错误的处理方式。
- 成员函数定义在类内部时默认是 inline 的候选，长函数应改到类外定义（用 ClassName:: 限定），头文件里只留声明，这样修改实现不会让所有包含者重编译。
- 命名惯例：数据成员加尾下划线（balance_）或 m_ 前缀，用来一眼区分「成员」与「参数/局部变量」，避免 this-> 满天飞。

**阅读**：《C++ Primer（第 5 版）》第 7 章 7.1 定义抽象数据类型（7.1.1~7.1.4）；cppreference: class

**动手**

- 写一个 BankAccount 类：数据成员 owner_ / balance_ 全 private，提供 deposit(double)、withdraw(double)、balance() const 三个成员函数，withdraw 金额超过余额时返回 false 且余额不变。
- 故意写一段 account.balance_ = -100; 让编译器报错，把报错信息抄下来，理解「访问控制是编译期检查」。

**完成标准**

- [ ] 能说出 class 与 struct 的默认访问级别差异，并说明为什么数据成员应当私有
- [ ] BankAccount 与 Student 两段代码都在本机编译运行通过
- [ ] 能用自己的话解释「封装是为了给不变量找唯一守门人」

**课后题（2 道）**

#### 第 1 题 · 封装一个 Student 类（难度 1/3）

实现 Student 类，数据成员 name_（std::string）、score_（int）必须为 private。提供：setName(const std::string&)、setScore(int)（分数超出 0~100 时忽略本次设置并返回 false）、name() const、score() const。在 main 中创建一个对象，依次设置合法与非法分数并打印结果。

验证标准：非法分数不改变原值，且全部 setter 返回值被检查（不允许出现未使用的返回值警告）。

**提示**：setter 用 if 提前 return false；getter 声明为 const 成员函数，这样 const Student& 也能调用。类外定义时写成 bool Student::setScore(int s) { ... }。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Student {
public:
    bool setName(const std::string& n) {
        if (n.empty()) return false;
        name_ = n;
        return true;
    }
    bool setScore(int s) {
        if (s < 0 || s > 100) return false;
        score_ = s;
        return true;
    }
    const std::string& name() const { return name_; }
    int score() const { return score_; }

private:
    std::string name_ = "未命名";
    int score_ = 0;
};

int main() {
    Student s;
    std::cout << std::boolalpha;
    std::cout << s.setName("林岚") << ' ' << s.setScore(88) << '\n';
    std::cout << s.name() << ' ' << s.score() << '\n';
    std::cout << s.setScore(150) << ' ' << s.setScore(-5) << '\n';
    std::cout << s.score() << '\n';   // 仍是 88
}
```
关键点：数据私有 + 校验集中在 setter，不变量（0<=score<=100）只有一处维护；getter 用 const 且返回 const 引用，避免拷贝又禁止外部改内部状态。

</details>

#### 第 2 题 · 用 Point 打破封装后再补回来（难度 2/3）

第一步：定义 struct Point { double x, y; }; 和一个函数 double dist(const Point& a, const Point& b);，实测 dist 可以正常调用。
第二步：把 Point 改成 class，x/y 移到 private，只暴露 x() const / y() const 与带参构造函数 Point(double, double)，此时 dist 必须改用 x()、y()。
第三步：在 Point 里加一个不变量——构造函数把坐标四舍五入到 0.1——并说明为什么这个不变量在 struct 版本里无法保证。

验证标准：两版程序输出相同的距离值；第三步能用一句话解释封装带来的能力。

**提示**：距离公式用 std::sqrt 或 std::hypot（<cmath>）。第三步的关键是：struct 版本里任何人都能写 p.x = 3.14159;，构造函数管不住后面发生的修改。

<details>
<summary>参考答案</summary>

```cpp
#include <cmath>
#include <iostream>

class Point {
public:
    Point(double x, double y)
        : x_(std::round(x * 10) / 10), y_(std::round(y * 10) / 10) {}
    double x() const { return x_; }
    double y() const { return y_; }

private:
    double x_, y_;
};

double dist(const Point& a, const Point& b) {
    return std::hypot(a.x() - b.x(), a.y() - b.y());
}

int main() {
    Point a(0.04, 3.06), b(4.0, 0.0);
    std::cout.precision(3);
    std::cout << a.x() << ' ' << a.y() << '\n';
    std::cout << dist(a, b) << '\n';
}
```
关键点：不变量要成立，必须同时满足「数据不可被外部直接改写」和「所有写入口都做同样处理」；只有把 x/y 变成 private 并强制走构造函数，四舍五入才不会被绕过。

</details>

---

### 周二 · 构造函数与初始化列表 —— 学习 / 1.5 小时

**今天学什么**

- 初始化列表是初始化，函数体赋值是赋值：对于 const 成员、引用成员、没有默认构造函数的类类型成员，只有初始化列表能工作，函数体赋值会直接编译失败。
- 成员初始化顺序只由声明顺序决定，与初始化列表的书写顺序无关，所以把列表写成与声明同序，否则 -Wreorder 警告背后往往是真实的依赖 bug。
- 委托构造（构造函数调用同类另一个构造函数）让「默认值」只写一处：Date() : Date(2000, 1, 1) {}，避免默认参数与校验逻辑重复。
- explicit 修饰单参构造函数可以阻止 string 隐式转成你的类型；需要隐式转换时是设计选择而非疏忽，写出来才算明确。

**阅读**：《C++ Primer（第 5 版）》第 7 章 7.1.4 构造函数、7.5 构造函数再探（7.5.1 构造函数初始值列表、7.5.2 委托构造函数、7.5.4 隐式的类类型转换）

**动手**

- 实现 Date 类（year_/month_/day_），要求：三参构造校验月份 1~12、天数不超过当月上限；两参构造默认 day=1（用委托构造实现）；无参构造委托到 Date(2000,1,1)。
- 写一个 std::string& 引用成员与一个 const int 成员的类 ImmutableId，证明只能靠初始化列表初始化，并尝试改成函数体赋值，记录编译器报错。

**完成标准**

- [ ] 能说出哪三类成员必须用初始化列表
- [ ] Date 的非法日期测试与闰年边界（2000 与 1900）都验证过
- [ ] 两道题都编译通过，且第 2 题保留了真实的编译错误信息

**课后题（2 道）**

#### 第 1 题 · 带校验的 Date 类（难度 2/3）

实现 Date 类：
- Date(int y, int m, int d)：校验 1<=m<=12、1<=d<=该月天数（闰年按 4 年一闰、百年不闰、四百年再闰处理），非法时抛出 std::invalid_argument（需要 #include <stdexcept>）。
- Date(int y, int m) 委托到上一版，day 取 1。
- Date() 委托到 Date(2000, 1, 1)。
- std::string toString() const 返回 2024-02-29 形式（月日补零）。

验证标准：main 中构造 2024-02-29 与 2023-02-29，后者的异常被 try/catch 捕获并打印错误信息。

**提示**：先写一个静态辅助函数 static bool isLeap(int y) 和 static int daysInMonth(int y, int m)，把 2 月特判放在 daysInMonth 里，构造函数只负责调用与抛异常。toString 用 std::to_string 加除法和取余手工补零。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

class Date {
public:
    Date(int y, int m, int d) : y_(y), m_(m), d_(d) {
        if (m_ < 1 || m_ > 12 || d_ < 1 || d_ > daysInMonth(y_, m_))
            throw std::invalid_argument("非法日期");
    }
    Date(int y, int m) : Date(y, m, 1) {}
    Date() : Date(2000, 1, 1) {}

    std::string toString() const {
        auto pad = [](int v) {
            return (v < 10 ? "0" : "") + std::to_string(v);
        };
        return std::to_string(y_) + "-" + pad(m_) + "-" + pad(d_);
    }

private:
    static bool isLeap(int y) {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }
    static int daysInMonth(int y, int m) {
        static const int base[12] = {31,28,31,30,31,30,31,31,30,31,30,31};
        if (m == 2 && isLeap(y)) return 29;
        return base[m - 1];
    }

    int y_, m_, d_;
};

int main() {
    std::cout << Date().toString() << '\n';
    std::cout << Date(2024, 2).toString() << '\n';
    std::cout << Date(2024, 2, 29).toString() << '\n';
    try {
        Date bad(2023, 2, 29);
        std::cout << bad.toString() << '\n';
    } catch (const std::invalid_argument& e) {
        std::cout << "catched: " << e.what() << '\n';
    }
}
```
关键点：三个构造函数都通过委托收敛到唯一带校验的实现，校验逻辑只有一份；月天数用 static 数组 + 闰年函数，构造函数只做判定与抛异常两件事。

</details>

#### 第 2 题 · 证明初始化列表不可替代（难度 3/3）

定义 Config 类，含一个 const int version_ 和一个 std::string& name_（引用成员）。
1) 用构造函数初始化列表正确初始化它们，并写 print() 打印两个值。
2) 注释掉初始化列表，改成在函数体内 version_ = v; name_ = n;，把编译器报错原文贴在代码注释里。
3) 用一段 2~3 行注释说明：为什么引用成员在函数体里「赋值」在语义上不成立。

验证标准：第 1 步能编译运行；第 2 步确实无法编译，且你记录了报错。

**提示**：引用必须在诞生时绑定到某个对象，构造函数的函数体执行时，成员就已经「诞生」过了——引用没有默认状态可言，所以只能靠初始化列表完成绑定。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Config {
public:
    // 第 2 步的反例（无法编译）：
    // Config(int v, std::string& n) {
    //     version_ = v;   // error C2789: 必须是可修改的左值 / const 成员不能赋值
    //     name_ = n;      // error C2530: 引用必须初始化，且此后不能再绑定
    // }
    Config(int v, std::string& n) : version_(v), name_(n) {}

    void print() const {
        std::cout << "version=" << version_ << " name=" << name_ << '\n';
    }

private:
    const int version_;
    std::string& name_;
};

int main() {
    std::string tag = "prod";
    Config c(3, tag);
    c.print();
    tag = "prod-2";
    c.print();   // 引用跟随原对象变化
}
```
关键点：初始化列表在成员「出生」时执行，函数体赋值发生在之后；const 成员出生后不可改，引用成员出生后不可重新绑定，因此这两类成员的赋值语句在语义上就不成立。

</details>

---

### 周三 · 析构函数与 RAII 与作用域 —— 学习 / 1 小时

**今天学什么**

- 析构函数在对象离开作用域、被 delete 或容器销毁元素时自动调用，它没有参数、不能重载，是「确定性清理」的入口，也是 C++ 与 GC 语言最大的体验差异。
- RAII = 资源获取即初始化：把资源的生命周期绑定到对象生命周期上，构造函数拿资源、析构函数放资源，于是「忘记释放」在语法上不可能发生。
- 局部对象按构造的逆序析构，这个保证是后续理解栈展开（异常传播时逐层析构）的前提，本周先把顺序本身观察清楚。
- 析构函数里抛异常极其危险：如果此时栈正在因为另一个异常而展开，程序会直接 terminate，所以析构函数体内的清理动作原则上不应失败，或必须在内部吞掉异常。

**阅读**：《C++ Primer（第 5 版）》第 7 章 7.1.5 拷贝、赋值和析构（析构部分）、第 12 章 12.1.1 动态内存与智能指针（RAII 思想）、13.1.3 析构函数做了什么；cppreference: destructor

**动手**

- 实现 ScopedTimer 类：构造时记录起点，析构时把「代码块耗时」打印到 stderr，用它在 main 里测量一段循环的耗时。
- 在一个作用域里创建 3 个 Tracer 对象（构造/析构各打印名字），确认析构顺序与构造顺序相反；再在中间插入一个内层 {} 块，观察内层对象先析构。

**完成标准**

- [ ] 能默写出析构函数的签名并说明它在哪些时机被调用
- [ ] Tracer 实验的预测与实际输出一致或能解释差异
- [ ] IntBuffer 的异常路径确实打印出释放信息

**课后题（2 道）**

#### 第 1 题 · 观察构造与析构的顺序（难度 1/3）

实现 Tracer 类：构造时打印 [ctor] 名字，析构时打印 [dtor] 名字，支持拷贝（拷贝构造也打印 [copy]）。在 main 中：
a) 在内层作用域 { Tracer a("a"), b("b"); } 里创建两个对象；
b) 把 Tracer 按值传给一个函数 void sink(Tracer t);；
c) 用一个 Tracer 对象按值初始化另一个 Tracer。

验证标准：输出中能数出每一份对象各自的构造/拷贝/析构配对，且能指出内层作用域的对象先于外层析构；把观察结论写成 3 行注释。

**提示**：按值传参和按值返回都会触发拷贝构造，析构次数与「曾经存在的对象个数」相等。先预测输出再运行，预测错了就回去看是哪一步多拷了一次。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Tracer {
public:
    explicit Tracer(std::string name) : name_(std::move(name)) {
        std::cout << "[ctor] " << name_ << '\n';
    }
    Tracer(const Tracer& other) : name_(other.name_) {
        std::cout << "[copy] " << name_ << '\n';
    }
    ~Tracer() { std::cout << "[dtor] " << name_ << '\n'; }

private:
    std::string name_;
};

void sink(Tracer t) { std::cout << "  in sink: " << "\n"; }

int main() {
    std::cout << "-- a) 内层作用域 --\n";
    {
        Tracer a("a"), b("b");
    }
    std::cout << "-- b) 按值传参 --\n";
    Tracer c("c");
    sink(c);
    std::cout << "-- c) 按值初始化 --\n";
    Tracer d = c;
    std::cout << "-- main 结束 --\n";
}
```
关键点：析构次数恒等于构造+拷贝次数，编译器不会漏掉任何一次；同一作用域内按构造逆序析构，内层作用域整体先于外层析构，这就是异常栈展开能安全清理的机制基础。

</details>

#### 第 2 题 · 用 RAII 管理一个整数缓冲区（难度 2/3）

实现 IntBuffer 类：构造函数申请 n 个 int（用 new int[n]{}），析构函数 delete[]，提供 int& at(int i)（越界抛 std::out_of_range）、int size() const。
要求：
1) main 中创建 IntBuffer，写入 0..n-1 并打印总和。
2) 在 at() 越界抛异常的情况下，让异常从作用域中传出并被 main 捕获，用打印验证缓冲区仍然被正常释放。
3) 注释说明：若把 new/delete 换成裸指针而不写析构函数，第 2 步会发生什么。

验证标准：程序正常退出（退出码 0），异常被捕获，且释放路径确实执行。

**提示**：把「分配」放在初始化列表或构造函数首行，把「释放」只放在析构函数里；测试释放可以用一个静态计数器或析构时打印一行。异常传播时栈展开会自动调用析构函数，这正是 RAII 的价值。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>

class IntBuffer {
public:
    explicit IntBuffer(int n) : n_(n), data_(new int[n]{}) {
        std::cout << "alloc " << n_ << '\n';
    }
    ~IntBuffer() {
        delete[] data_;
        std::cout << "free " << n_ << '\n';   // 释放路径可见
    }
    IntBuffer(const IntBuffer&) = delete;
    IntBuffer& operator=(const IntBuffer&) = delete;

    int& at(int i) {
        if (i < 0 || i >= n_) throw std::out_of_range("index");
        return data_[i];
    }
    int size() const { return n_; }

private:
    int n_;
    int* data_;
};

int main() {
    try {
        IntBuffer buf(5);
        for (int i = 0; i < buf.size(); ++i) buf.at(i) = i;
        int sum = 0;
        for (int i = 0; i < buf.size(); ++i) sum += buf.at(i);
        std::cout << "sum=" << sum << '\n';
        buf.at(7) = 1;            // 抛异常，buf 在栈展开中被析构
    } catch (const std::out_of_range& e) {
        std::cout << "caught: " << e.what() << '\n';
    }
    std::cout << "bye\n";
}
```
关键点：异常从 buf 的作用域逃出时，编译器插入的栈展开代码会调用 buf 的析构函数，所以「抛异常 = 泄漏」只在手写裸指针时成立；删除拷贝操作避免两个对象持有同一块内存而双重释放。

</details>

---

### 周四 · this 指针、const 成员函数与链式调用 —— 学习 / 1.5 小时

**今天学什么**

- this 是指向「调用本函数的那个对象」的指针，在非静态成员函数中隐含存在；返回 *this 的引用即可实现链式调用，返回类型必须是引用，否则每次链式都拷贝一个新对象。
- const 成员函数承诺不修改对象状态（this 视为 const 指针），它是重载决议的一部分，因此可以按对象是否 const 提供两个版本：非 const 版返回可变引用，const 版返回 const 引用。
- const 对象只能调用 const 成员函数，所以给所有不修改状态的成员函数加 const 不是风格洁癖，而是让别人能把你的类型放进 const 引用参数、const 容器里的必要条件。
- mutable 成员可以在 const 成员函数中修改，用于缓存、计数器、互斥量这类「不改变逻辑状态」的成员；除此之外在 const 函数里改成员都应视为设计问题。

**阅读**：《C++ Primer（第 5 版）》第 7 章 7.1.2 定义改进的 Sales_data 类（this 与 const 成员函数）、7.3.1 返回 *this 的成员函数、7.1.3 定义类相关的非成员函数；cppreference: this, const member function

**动手**

- 实现 StringBuilder 类（内部 std::string 缓冲区），提供 append(const std::string&)、appendLine(const std::string&)、clear()，全部返回 StringBuilder& 以支持链式调用。
- 给一个 IntArray 类的 operator[] 写 const 与非 const 两个重载版本，并在 main 中分别用 IntArray 与 const IntArray& 触发出不同版本（用打印区分）。

**完成标准**

- [ ] 能解释为什么链式调用必须返回引用
- [ ] IntArray 的 const 与非 const 重载都被实际调用过
- [ ] mutable 的适用场景能举出至少两个例子（缓存、计数器/互斥量）

**课后题（3 道）**

#### 第 1 题 · 链式 StringBuilder（难度 1/3）

实现 StringBuilder 类，内部只用 std::string 存储。
- append(const std::string&) 追加文本并返回 *this 的引用；
- appendLine(const std::string&) 先追加文本再追加 '\n'；
- size() const 返回当前长度；
- str() const 返回内容的 const 引用。
在 main 中写一条连续链式调用（至少 4 个方法）产生 3 行文本并打印，同时打印最终长度。

验证标准：链式调用返回的是同一对象（可用 &b.append(...) == &b 断言），且程序无内存错误。

**提示**：每个方法末尾写 return *this;，函数返回类型写 StringBuilder&。如果要让链式能「延长临时对象」，可以再补一个右值引用重载，但本周只需引用版本。

<details>
<summary>参考答案</summary>

```cpp
#include <cassert>
#include <iostream>
#include <string>

class StringBuilder {
public:
    StringBuilder& append(const std::string& s) {
        buf_ += s;
        return *this;
    }
    StringBuilder& appendLine(const std::string& s) {
        buf_ += s;
        buf_ += '\n';
        return *this;
    }
    StringBuilder& clear() {
        buf_.clear();
        return *this;
    }
    std::size_t size() const { return buf_.size(); }
    const std::string& str() const { return buf_; }

private:
    std::string buf_;
};

int main() {
    StringBuilder b;
    &b.appendLine("第一行");
    assert(&b.append("x") == &b);          // 返回的是自己
    b.clear().appendLine("第一行").appendLine("第二行").append("第三行");
    std::cout << b.str() << "len=" << b.size() << '\n';
}
```
关键点：返回 *this 的引用而不是值，才能保证链上操作的始终是同一个对象（assert 就是在验证这一点）；size()/str() 加 const，使 const StringBuilder& 也能读取内容。

</details>

#### 第 2 题 · const 与非 const 的 operator[] 重载（难度 2/3）

实现 IntArray 类（大小固定为构造传入的 n，内部用 std::vector<int>）：
- int& operator[](std::size_t i)（非 const 版，允许 a[0] = 5）；
- const int& operator[](std::size_t i) const（const 版）；
- 两版都要在越界时抛出 std::out_of_range；
- 打印 void print(const IntArray& a) 的实现，验证它只能走 const 版。

在 main 中：用非 const 对象写入数据，用 const 引用读取数据，并让越界访问抛出异常被捕获。

验证标准：两份代码区分明显（例如两版分别打印 "non-const []" 与 "const []"），且越界行为一致。

**提示**：重载决议只看「this 的 const 属性」；可以把公共的边界检查抽成一个 private 的 void check(std::size_t) const 供两版复用，避免重复。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>

class IntArray {
public:
    explicit IntArray(std::size_t n) : data_(n, 0) {}

    int& operator[](std::size_t i) {
        check(i);
        std::cout << "non-const []\n";
        return data_[i];
    }
    const int& operator[](std::size_t i) const {
        check(i);
        std::cout << "const []\n";
        return data_[i];
    }
    std::size_t size() const { return data_.size(); }

private:
    void check(std::size_t i) const {
        if (i >= data_.size()) throw std::out_of_range("index");
    }
    std::vector<int> data_;
};

void print(const IntArray& a) {
    for (std::size_t i = 0; i < a.size(); ++i) std::cout << a[i] << ' ';
    std::cout << '\n';
}

int main() {
    IntArray a(4);
    a[0] = 10;
    a[1] = 20;
    a[2] = 30;
    print(a);
    try {
        std::cout << a[9] << '\n';
    } catch (const std::out_of_range& e) {
        std::cout << "caught: " << e.what() << '\n';
    }
}
```
关键点：const 属性参与重载，print 的参数是 const IntArray&，因此必然调用 const 版；把边界检查收进 private const 函数，两个版本共用一份判定，行为不会漂移。

</details>

#### 第 3 题 · 用 mutable 缓存统计结果（难度 3/3）

实现 Stats 类，内部 std::vector<double> data_，提供：
- add(double)（追加数据，并使缓存失效）；
- double mean() const（返回平均值，空数据返回 0）；
- std::size_t cacheHits() const 返回缓存命中次数。
要求 mean() 是 const 成员函数，但内部用 mutable 成员缓存已计算的平均值与有效性标记；连续两次调用 mean() 时第二次必须命中缓存（cacheHits 增加）。

验证标准：main 中 add 三个数后连续调用 mean() 两次，打印两个相同的结果和 cacheHits()==1；再 add 一个数后调用 mean()，缓存失效并重新计算。

**提示**：缓存字段写成 mutable double cached_ = 0; mutable bool valid_ = false; mutable std::size_t hits_ = 0;。add 里把 valid_ 置 false，mean 里判断 valid_ 决定是否重算。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <numeric>
#include <vector>

class Stats {
public:
    void add(double v) {
        data_.push_back(v);
        valid_ = false;              // 数据变了，缓存作废
    }
    double mean() const {
        if (!valid_) {
            cached_ = data_.empty()
                          ? 0.0
                          : std::accumulate(data_.begin(), data_.end(), 0.0) / data_.size();
            valid_ = true;
        } else {
            ++hits_;
        }
        return cached_;
    }
    std::size_t cacheHits() const { return hits_; }

private:
    std::vector<double> data_;
    mutable double cached_ = 0.0;    // 不改变逻辑状态，故可 mutable
    mutable bool valid_ = false;
    mutable std::size_t hits_ = 0;
};

int main() {
    Stats s;
    s.add(1.0);
    s.add(2.0);
    s.add(4.0);
    std::cout << s.mean() << ' ' << s.mean() << ' ' << s.cacheHits() << '\n';
    s.add(5.0);
    std::cout << s.mean() << ' ' << s.cacheHits() << '\n';
}
```
关键点：缓存对调用者不可见，属于「实现细节」而非对象状态，所以用 mutable 让它能在 const 函数里改动；任何写操作都必须把 valid_ 置 false，否则会返回过期结果。

</details>

---

### 周五 · static 成员与友元入门 —— 学习 / 1.5 小时

**今天学什么**

- static 数据成员属于类而不属于对象，所有对象共享一份，必须在类外定义一次（C++17 起可用 inline static 在类内直接定义并初始化），类内写 static int count_; 只是声明。
- static 成员函数没有 this，因此不能访问非静态成员，却可以在没有对象的情况下调用（Counter::total()），常用来做工厂函数、工具函数和访问共享状态。
- 友元（friend）是「单向打破封装」的授权：友元函数或友元类可以访问 private 成员，但它不是成员函数、不继承、不传递，滥用会让封装形同虚设。
- 友元的经典用途是让非成员运算符（尤其是 operator<<）看到私有数据；能用公有成员函数实现时优先用公有接口，只有在无法避免时才开友元。

**阅读**：《C++ Primer（第 5 版）》第 7 章 7.6 类的静态成员、7.2.1 友元（friend 声明）、7.3.4 友元再探（非成员运算符与友元）

**动手**

- 给 Counter 类加 static int created_;，在构造函数里 ++created_、析构函数里 --created_，实现 static int alive() 返回当前存活对象数，用作用域块验证计数上下浮动。
- 写一个 Money 类（long cents_ 私有），用 friend std::ostream& operator<<(std::ostream&, const Money&) 打印 12.34 形式，并在 main 中 cout << m << '\n';。

**完成标准**

- [ ] 能说出 static 数据成员为什么必须在类外定义（或 C++17 用 inline static）
- [ ] Counter 的存活计数在作用域进出前后数值正确
- [ ] 能解释友元函数的三个「不是」：不是成员、不被继承、不具有传递性

**课后题（2 道）**

#### 第 1 题 · Counter 与存活对象计数（难度 2/3）

实现 Counter 类：
- 每个对象有一个 id_（由 static int nextId_ 递增分配）；
- 用 static 统计当前存活对象数 alive；
- 提供工厂 static Counter make();
- 提供 int id() const 与 static int aliveCount()。
在 main 中：创建 3 个对象，打印 id 与 aliveCount；在作用域内创建一个对象，退出作用域后再打印 aliveCount，确认减 1。

注意：为了让计数正确，需要正确处理拷贝（拷贝也是新对象）。

验证标准：aliveCount 的数值与作用域内实际存活的对象数一致，退出作用域后归零（如果那时已无对象）。

**提示**：nextId_ 和 alive_ 用 inline static 在类内定义（C++17），省去类外定义。拷贝构造时要 ++alive_ 并分配新 id，否则计数的语义会混乱。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

class Counter {
public:
    Counter() : id_(++nextId_) { ++alive_; }
    Counter(const Counter&) : id_(++nextId_) { ++alive_; }
    ~Counter() { --alive_; }

    int id() const { return id_; }
    static int aliveCount() { return alive_; }
    static Counter make() { return Counter{}; }

private:
    int id_;
    inline static int nextId_ = 0;
    inline static int alive_ = 0;
};

int main() {
    std::cout << "start alive=" << Counter::aliveCount() << '\n';
    Counter a, b, c;
    std::cout << a.id() << ' ' << b.id() << ' ' << c.id() << '\n';
    std::cout << "main alive=" << Counter::aliveCount() << '\n';
    {
        Counter d = Counter::make();
        Counter e = d;                       // 拷贝 = 新对象
        std::cout << "inner alive=" << Counter::aliveCount() << '\n';
    }
    std::cout << "after scope alive=" << Counter::aliveCount() << '\n';
}
```
关键点：static 成员被所有对象共享，因此构造/析构里的增减就等价于「当前存活数量」；拷贝构造也必须计数，否则深层返回、按值传参都会让计数失真。

</details>

#### 第 2 题 · 用友元实现 operator<<（难度 3/3）

实现 Money 类（内部 long cents_，private），支持：
- Money(long yuan, long fen) 与 explicit Money(long cents)；
- Money operator+(const Money&) const；
- friend std::ostream& operator<<(std::ostream& os, const Money& m) 输出形如 12.05 的字符串（分永远两位，负数正确显示为 -0.05）；
- friend std::istream& operator>>(std::istream& is, Money& m) 读入两个整数（元、分）。
在 main 中输入两次 Money 并打印它们的和。

验证标准：12 元 5 分打印为 12.05；输入 1 5 与 2 95 时和打印为 4.00。

**提示**：输出时先算绝对值，用整数除法和取余得到元、分，分不足两位补 0；符号单独处理。注意 operator+ 是成员函数，返回新对象（值语义）。

<details>
<summary>参考答案</summary>

```cpp
#include <cstdlib>
#include <iostream>
#include <iomanip>

class Money {
public:
    Money(long yuan, long fen) : cents_(yuan * 100 + (yuan < 0 ? -fen : fen)) {}
    explicit Money(long cents) : cents_(cents) {}

    Money operator+(const Money& other) const {
        return Money(cents_ + other.cents_);
    }

    friend std::ostream& operator<<(std::ostream& os, const Money& m);
    friend std::istream& operator>>(std::istream& is, Money& m);

private:
    long cents_;
};

std::ostream& operator<<(std::ostream& os, const Money& m) {
    long v = m.cents_;
    const char* sign = v < 0 ? "-" : "";
    if (v < 0) v = -v;
    os << sign << v / 100 << '.' << std::setw(2) << std::setfill('0') << v % 100;
    return os;
}

std::istream& operator>>(std::istream& is, Money& m) {
    long y = 0, f = 0;
    is >> y >> f;
    m.cents_ = y * 100 + (y < 0 ? -f : f);
    return is;
}

int main() {
    Money a(12, 5), b(1, 5);
    std::cout << a << " + " << b << " = " << (a + b) << '\n';
    Money x(0), y(0);
    if (std::cin >> x >> y) std::cout << (x + y) << '\n';
}
```
关键点：operator<< 必须是非成员函数（左操作数是 ostream），所以要用 friend 才能读 private 的 cents_；输出用 std::setw/std::setfill 保证分始终两位，符号单独处理避免 -0.5 之类格式错误。

</details>

---

### 周六 · 项目日：BankAccount 完整类设计 —— 项目 / 2 小时

**今天学什么**

- 把本周的封装、构造、析构、const、static 串起来：一个「能用」的类，其价值在于任何时刻对象都满足不变量，且所有操作都有明确失败方式。
- 交易记录用 std::vector<Transaction> 保存，Transaction 作为嵌套的 public struct 只承载数据；这体现「class 管行为、struct 管数据」的分工。
- 错误处理在本周统一用「返回值 + 校验」，等到第 4 周再系统性换成异常，届时你才能对比两种风格的取舍。

**阅读**：《C++ Primer（第 5 版）》第 7 章全章回顾（7.1~7.6），重点 7.1.4 与 7.6

**动手**

- 实现 BankAccount：private 的 owner_、balance_(long，单位分)、std::vector<Transaction> history_；提供 deposit(long)、withdraw(long)（余额不足返回 false）、balance() const、const std::vector<Transaction>& history() const、static int accountCount()。
- 给所有只读成员函数补 const，把整个类的对象用 const BankAccount& 传进一个打印函数，确认装不上就说明 const 正确性还没做完。

**完成标准**

- [ ] BankAccount 的非法参数、余额不足、转账自环三条失败路径都测过
- [ ] 所有只读成员函数都是 const，且 printAccount 只用 const 引用就能工作
- [ ] 能完整写出本周用过的 6 个概念（封装/构造/初始化列表/析构/const/static）各自解决了什么问题

**课后题（2 道）**

#### 第 1 题 · BankAccount 完整实现（难度 3/3）

实现 BankAccount 类，满足：
1) 构造：BankAccount(std::string owner, long initialCents)，初始金额为负时抛 std::invalid_argument；
2) deposit(long cents)：cents<=0 返回 false，否则余额增加并追加一条 Transaction{type=Deposit, amount}；
3) withdraw(long cents)：cents<=0 或超过余额返回 false，否则余额减少并追加 Transaction{type=Withdraw, amount}；
4) balance() const、owner() const、history() const 返回 const 引用；
5) static int accountCount() 统计存活账户数；
6) 一个非成员函数 void printAccount(const BankAccount&) 打印户主、余额（元，两位小数）与全部交易记录。

验收标准：main 里依次做「存 10000 分 → 取 3000 分 → 试图取 999999 分（失败）→ 非法初始金额（抛异常被捕获）」，输出的最终余额为 70.00，交易记录恰好 2 条，且全程 printAccount 只接收 const 引用。

**提示**：嵌套 struct Transaction { enum class Type { Deposit, Withdraw }; Type type; long cents; }; 放在 public 区域。printAccount 通过 history() 的 const 引用遍历，用 setw/setfill 格式化金额。accountCount 用 inline static int count_ = 0; 在构造/析构（含拷贝构造）中维护。

<details>
<summary>参考答案</summary>

```cpp
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

class BankAccount {
public:
    struct Transaction {
        enum class Type { Deposit, Withdraw };
        Type type;
        long cents;
    };

    BankAccount(std::string owner, long initialCents) : owner_(std::move(owner)) {
        if (initialCents < 0) throw std::invalid_argument("初始金额不能为负");
        balance_ = initialCents;
        ++count_;
    }
    BankAccount(const BankAccount& other)
        : owner_(other.owner_), balance_(other.balance_), history_(other.history_) {
        ++count_;
    }
    ~BankAccount() { --count_; }

    bool deposit(long cents) {
        if (cents <= 0) return false;
        balance_ += cents;
        history_.push_back({Transaction::Type::Deposit, cents});
        return true;
    }
    bool withdraw(long cents) {
        if (cents <= 0 || cents > balance_) return false;
        balance_ -= cents;
        history_.push_back({Transaction::Type::Withdraw, cents});
        return true;
    }

    long balance() const { return balance_; }
    const std::string& owner() const { return owner_; }
    const std::vector<Transaction>& history() const { return history_; }
    static int accountCount() { return count_; }

private:
    std::string owner_;
    long balance_ = 0;
    std::vector<Transaction> history_;
    inline static int count_ = 0;
};

static void printMoney(std::ostream& os, long cents) {
    const char* sign = cents < 0 ? "-" : "";
    if (cents < 0) cents = -cents;
    os << sign << cents / 100 << '.' << std::setw(2) << std::setfill('0') << cents % 100;
}

void printAccount(const BankAccount& acc) {
    std::cout << "户主: " << acc.owner() << "  余额: ";
    printMoney(std::cout, acc.balance());
    std::cout << "\n交易 " << acc.history().size() << " 条:\n";
    for (const auto& t : acc.history()) {
        std::cout << "  " << (t.type == BankAccount::Transaction::Type::Deposit ? "存入 " : "取出 ");
        printMoney(std::cout, t.cents);
        std::cout << '\n';
    }
}

int main() {
    try {
        BankAccount acc("林岚", 10000);
        acc.deposit(10000);                       // +10000
        acc.deposit(0);                           // 失败
        acc.withdraw(3000);                       // 先取 3000
        std::cout << std::boolalpha;
        std::cout << "取 999999: " << acc.withdraw(999999) << '\n';
        printAccount(acc);
        std::cout << "账户数: " << BankAccount::accountCount() << '\n';
        BankAccount bad("张三", -1);              // 抛异常
    } catch (const std::invalid_argument& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
}
```
关键点：把余额单位统一成分（long）避免浮点误差；所有写入口先校验再修改，保证「余额 >= 0」这一不变量；printAccount 只接受 const 引用，反向验证了只读接口的 const 正确性。

</details>

#### 第 2 题 · 给 BankAccount 加转账与对账（难度 3/3）

在上一题的基础上扩展（可以独立文件）：
1) 增加成员函数 bool transferTo(BankAccount& other, long cents)：参数非法或余额不足返回 false，成功则本账户记录 Withdraw、对方记录 Deposit；
2) 增加 long sumOfHistory() const：把 history_ 中所有交易按「存入为正、取出为负」求代数和，用于对账；
3) 在 main 中验证：两个账户初始各 100.00 与 0.00，A 转给 B 50.00 后，两边 sumOfHistory 都等于各自当前余额。

验收标准：转账失败时两个账户的余额和交易条数都不变（强一致：要么都成功，要么都不做）。

**提示**：把校验全部放在修改之前：先判断 cents>0、this != &other、cents <= balance_，三者都通过再改两个账户。先把失败路径测试写出来，再写成功路径。

<details>
<summary>参考答案</summary>

```cpp
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

class BankAccount {
public:
    struct Transaction {
        enum class Type { Deposit, Withdraw };
        Type type;
        long cents;
    };

    BankAccount(std::string owner, long initialCents) : owner_(std::move(owner)), balance_(initialCents) {
        if (initialCents < 0) throw std::invalid_argument("初始金额不能为负");
    }

    bool deposit(long cents) {
        if (cents <= 0) return false;
        balance_ += cents;
        history_.push_back({Transaction::Type::Deposit, cents});
        return true;
    }
    bool withdraw(long cents) {
        if (cents <= 0 || cents > balance_) return false;
        balance_ -= cents;
        history_.push_back({Transaction::Type::Withdraw, cents});
        return true;
    }
    bool transferTo(BankAccount& other, long cents) {
        if (cents <= 0 || this == &other || cents > balance_) return false;
        withdraw(cents);
        other.deposit(cents);
        return true;
    }

    long balance() const { return balance_; }
    long sumOfHistory() const {
        long sum = 0;
        for (const auto& t : history_) {
            sum += (t.type == Transaction::Type::Deposit ? t.cents : -t.cents);
        }
        return sum;
    }

private:
    std::string owner_;
    long balance_;
    std::vector<Transaction> history_;
};

static void show(const char* tag, const BankAccount& a) {
    std::cout << tag << " balance=" << a.balance() / 100.0
              << " reconciled=" << (a.sumOfHistory() == a.balance() ? "yes" : "no")
              << '\n';
}

int main() {
    BankAccount a("A", 10000), b("B", 0);
    std::cout << std::boolalpha;
    std::cout << "transfer ok: " << a.transferTo(b, 5000) << '\n';
    std::cout << "transfer too big: " << a.transferTo(b, 999999) << '\n';
    std::cout << "transfer to self: " << a.transferTo(a, 100) << '\n';
    show("A", a);
    show("B", b);
}
```
关键点：transferTo 把所有失败条件在修改之前一次性判完，失败即返回、不产生任何副作用，这是「强一致」的最小实现方式；把资金单位继续统一为分，使对账等式 sumOfHistory() == balance() 可以精确比较。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回看本周笔记，把「初始化列表 vs 函数体赋值」「const 成员函数是重载的一部分」两条用自己的话重写一遍。

**阅读**：《C++ Primer（第 5 版）》第 7 章小结

**动手**

- 可选任务：把上周写的任意一个 struct（如 Point 或学生成绩结构体）改造成封装类，加上构造函数校验与 const 只读接口。

**完成标准**

- [ ] 五个判断题已作答并与笔记核对
- [ ] 错题记录已写下，知道自己下周要留意什么

**课后题（1 道）**

#### 第 1 题 · 轻量自测：五个判断题（难度 1/3）

不看笔记回答，然后翻回本周内容核对：
1) class 里没有写访问说明符的成员默认是什么访问级别？
2) 成员初始化顺序由什么决定？
3) const 成员函数里能不能修改 mutable 成员？
4) static 数据成员属于对象还是类？C++17 起可以在类内定义吗？
5) 返回 *this 时返回类型写成值类型会有什么后果？

**提示**：先全部写下答案再看书，把答错的条目单独记一行，下周开工前再扫一遍。

<details>
<summary>参考答案</summary>

```cpp
// 参考答案（可直接编译验证第 3、5 条）：
#include <iostream>

class Demo {
public:
    Demo& bump() { ++value_; return *this; }        // 返回引用：链式作用于同一对象
    Demo bumpCopy() const { Demo d(*this); ++d.value_; return d; }  // 返回值：副本被修改
    void touch() const { ++calls_; }                 // mutable 允许在 const 函数中改
    int value() const { return value_; }
    int calls() const { return calls_; }

private:
    int value_ = 0;
    mutable int calls_ = 0;
};

int main() {
    Demo d;
    d.touch();
    std::cout << "calls=" << d.calls() << '\n';
    d.bump().bump().bump();
    std::cout << "chained value=" << d.value() << '\n';   // 3
    d.bumpCopy();
    std::cout << "after copy-modify value=" << d.value() << '\n';  // 仍是 3
}
```
答案：1) private；2) 成员的声明顺序，与初始化列表书写顺序无关；3) 可以，mutable 正是为此存在；4) 属于类，所有对象共享一份，C++17 起可用 inline static 在类内定义并初始化；5) 每次链式调用都在修改一个临时副本，原对象不变（上面的 bumpCopy 演示了这一点）。

</details>

---

## 第 2 周 · 拷贝控制与运算符重载

**本周目标**：掌握对象「怎么被复制、怎么被移动、怎么参与运算」：写出正确的三法则类，区分深浅拷贝，理解 std::move 偷资源的机制，并能让自定义类型像内置类型一样参与 + - == << += 与下标访问。

### 周一 · 三法则：编译器替你生成了什么 —— 学习 / 1.5 小时

**今天学什么**

- 三法则说的是：如果你需要自定义析构函数、拷贝构造函数、拷贝赋值运算符中的任意一个，那么这三个你几乎都需要——因为它们共同负责同一份资源，只写一个是典型的半成品。
- 编译器按需合成拷贝构造与拷贝赋值，合成版本对每个成员逐个执行拷贝（对指针成员就是复制地址，即浅拷贝），这正是「两个对象指向同一块内存」的根源。
- = default 是显式要求编译器生成默认实现（比手写更不容易出错、也能保持 trivially copyable 的优化），= delete 则是彻底禁止该操作，例如禁止拷贝的文件句柄或单例。
- 只要类里有原始指针成员并自行管理其生命周期，拷贝操作就必须自己写；没有资源成员的类应当依赖默认版本，多写只会引入 bug。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.1 拷贝、赋值与销毁（13.1.1 拷贝构造函数、13.1.2 拷贝赋值运算符、13.1.3 析构函数、13.1.4 三/五法则、13.1.5 使用 = default、13.1.6 阻止拷贝）；cppreference: rule of three

**动手**

- 实现 TrackedResource 类：带 static 计数，成员是 std::vector<int>；分别用 = default 与 = delete 控制拷贝构造/拷贝赋值，在 main 中观察哪些语句能编译、哪些不能。
- 写一个只定义析构函数却使用默认拷贝的类（含指针成员），观察运行结果，把现象记录成 3 行注释。

**完成标准**

- [ ] 能说出编译器在什么条件下合成拷贝构造与拷贝赋值
- [ ] 能写出三法则的完整表述并解释它为什么成立
- [ ] 已亲眼观察到浅拷贝导致的析构异常（保留输出或注释记录）

**课后题（2 道）**

#### 第 1 题 · 用 = default 与 = delete 控制拷贝（难度 1/3）

实现两个类：
1) Copyable：成员 std::vector<int> data_，拷贝构造与拷贝赋值都用 = default，提供 push(int)、size() const、sum() const。
2) Unique：同上成员，但用 = delete 禁止拷贝构造与拷贝赋值，只允许移动（可以先用 = default 移动）。
在 main 中：拷贝一个 Copyable 并修改副本，验证原对象不受影响；对 Unique 写一行 `Unique u2 = u1;` 但用注释标注它无法编译，并贴上报错关键词。

验证标准：程序编译运行通过，Copyable 的两份数据相互独立（打印两个 sum），且注释中说明 = delete 触发的编译错误类型。

**提示**：= default 写在声明位置（类内），= delete 同样写在类内声明处。vector 成员本身会做深拷贝，所以默认版本对 vector 是安全的——这也解释了为什么你不该手写。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <vector>

class Copyable {
public:
    Copyable() = default;
    Copyable(const Copyable&) = default;
    Copyable& operator=(const Copyable&) = default;

    void push(int v) { data_.push_back(v); }
    std::size_t size() const { return data_.size(); }
    int sum() const {
        int s = 0;
        for (int v : data_) s += v;
        return s;
    }

private:
    std::vector<int> data_;
};

class Unique {
public:
    Unique() = default;
    Unique(const Unique&) = delete;              // 禁止拷贝
    Unique& operator=(const Unique&) = delete;   // 禁止拷贝赋值
    Unique(Unique&&) = default;                  // 移动仍然可用
    Unique& operator=(Unique&&) = default;

    void push(int v) { data_.push_back(v); }
    int sum() const {
        int s = 0;
        for (int v : data_) s += v;
        return s;
    }

private:
    std::vector<int> data_;
};

int main() {
    Copyable c1;
    c1.push(1);
    c1.push(2);
    Copyable c2 = c1;        // 默认拷贝构造：vector 各自一份
    c2.push(100);
    std::cout << "c1 sum=" << c1.sum() << " size=" << c1.size() << '\n';
    std::cout << "c2 sum=" << c2.sum() << " size=" << c2.size() << '\n';

    Unique u1;
    u1.push(7);
    Unique u2 = std::move(u1);   // 移动可以
    // Unique u3 = u2;           // error C2280: 尝试引用已删除的函数
    std::cout << "u2 sum=" << u2.sum() << '\n';
}
```
关键点：= default 让编译器生成逐成员版本，对 vector 这类自带深拷贝的成员成员完全正确；= delete 把「不该发生的操作」从运行期错误提升为编译期错误，比写注释文档可靠得多。

</details>

#### 第 2 题 · 捕获浅拷贝的双重释放（难度 2/3）

写一个「坏」的类 BadIntArray：成员 int* data_; 与 int n_; 构造函数 new int[n]{}，析构函数 delete[] data_;，**不写拷贝构造与拷贝赋值**（使用编译器合成版本）。
1) 在 main 中写 `BadIntArray a(3); BadIntArray b = a;`，运行程序并记录结果（可能崩溃、可能打印后 heap corruption）。
2) 再加一个按值传参的函数 void consume(BadIntArray x) 并调用它，观察崩溃是否更早出现。
3) 用 3~5 行注释解释：哪两次 delete[] 作用在同一地址上，为什么会出现双重释放。

验证标准：你能明确指出「合成拷贝构造只复制了 data_ 指针值」，并说明为何在 Debug/Release 下现象可能不同。

**提示**：两个对象的 data_ 是同一个地址，析构时都会执行 delete[]，第二次就是未定义行为。想看清地址，可以在构造和析构里打印 data_ 的地址。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

class BadIntArray {
public:
    explicit BadIntArray(int n) : data_(new int[n]{}), n_(n) {
        std::cout << "ctor data=" << static_cast<void*>(data_) << '\n';
    }
    ~BadIntArray() {
        std::cout << "dtor data=" << static_cast<void*>(data_) << '\n';
        delete[] data_;    // 第二次对同一地址执行就是双重释放
    }
    int& at(int i) { return data_[i]; }
    int size() const { return n_; }

private:
    int* data_;
    int n_;
};

void consume(BadIntArray x) { std::cout << "  consume size=" << x.size() << '\n'; }

int main() {
    BadIntArray a(3);
    a.at(0) = 42;
    BadIntArray b = a;                 // 合成拷贝：两个对象共用 data_
    std::cout << "b[0]=" << b.at(0) << '\n';
    consume(a);                        // 又复制一份，析构更早发生
    std::cout << "main 结束\n";
}
```
关键点：合成拷贝构造对指针成员只复制地址，于是 a、b 以及形参 x 的 data_ 指向同一块堆内存，三次析构会执行三次 delete[]，第二次开始就是未定义行为（常见表现是 heap corruption 或 abort）。正确做法是写深拷贝（见 w2d2），而不是依赖默认实现。

</details>

---

### 周二 · 深拷贝与拷贝赋值 —— 学习 / 1.5 小时

**今天学什么**

- 深拷贝 = 为新对象重新申请一块同样大小的资源并复制内容，使两个对象的生命周期彻底解耦；判断标准是「销毁任意一个对象，另一个仍然可用」。
- 拷贝赋值比拷贝构造多两个坑：必须先释放自己原有的资源（否则泄漏），并且必须先判断自赋值 a = a（否则先删掉自己的资源再读它，直接拿到已释放内存）。
- 「先拷贝、再释放、后接管」（copy-and-swap）或先分配新内存再 delete 旧内存，是避免中途抛异常导致半成品状态的稳妥写法。
- 拷贝赋值的返回类型是 T& 并返回 *this，这样才能支持链式赋值 a = b = c，也与内置类型的语义一致。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.1.2 拷贝赋值运算符、13.2 拷贝控制和资源管理（13.2.1 行为像值的类、13.2.2 定义行为像指针的类）

**动手**

- 实现 IntArray 的完整三法则：拷贝构造做深拷贝、拷贝赋值做「判自赋值 + 释放旧资源 + 申请 + 复制」、析构 delete[]。
- 在拷贝赋值里临时注释掉自赋值判断，写一个 a = a; 的测试并观察现象，然后恢复判断。

**完成标准**

- [ ] 能说出拷贝赋值必须处理的三个额外问题：释放旧资源、自赋值、返回 *this
- [ ] IntArray 的深拷贝测试通过（修改副本不影响原对象）
- [ ] 能自己讲清 copy-and-swap 为什么能提供强异常安全

**课后题（2 道）**

#### 第 1 题 · IntArray 的深拷贝三法则（难度 2/3）

实现 IntArray：
- explicit IntArray(int n, int init = 0)：申请 n 个 int 并初始化为 init；
- 拷贝构造：深拷贝；
- 拷贝赋值：处理自赋值并返回 IntArray&；
- 析构：delete[]；
- int& at(int i)、int size() const；
- void fill(int v) 把所有元素设为 v。
验收：
```cpp
IntArray a(4, 1);
IntArray b = a;        // 深拷贝
b.fill(9);
a.at(0) = 100;
std::cout << a.sum() << ' ' << b.sum() << '\n';  // 104 36
IntArray c(2, 5);
c = c;                 // 自赋值：不得崩溃、数据不变
c = a;                 // 重新赋值：先释放旧资源
std::cout << c.sum() << ' ' << a.sum() << '\n';  // 104 104
```
（sum() 请自行实现）

**提示**：拷贝赋值的安全顺序：先判断 this == &other，然后 new 一块新内存、把数据拷过去，最后 delete[] 旧指针并把成员指向新内存。这样即使中途抛异常，对象也还是完整的旧状态。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : n_(n), data_(new int[n]) {
        std::fill(data_, data_ + n_, init);
    }
    IntArray(const IntArray& other) : n_(other.n_), data_(new int[other.n_]) {
        std::copy(other.data_, other.data_ + other.n_, data_);
    }
    IntArray& operator=(const IntArray& other) {
        if (this == &other) return *this;              // 自赋值
        int* fresh = new int[other.n_];                // 先申请、再拷贝
        std::copy(other.data_, other.data_ + other.n_, fresh);
        delete[] data_;                                // 后释放旧资源
        data_ = fresh;
        n_ = other.n_;
        return *this;
    }
    ~IntArray() { delete[] data_; }

    int& at(int i) { return data_[i]; }
    const int& at(int i) const { return data_[i]; }
    int size() const { return n_; }
    void fill(int v) { std::fill(data_, data_ + n_, v); }
    int sum() const {
        int s = 0;
        for (int i = 0; i < n_; ++i) s += data_[i];
        return s;
    }

private:
    int n_ = 0;
    int* data_ = nullptr;
};

int main() {
    IntArray a(4, 1);
    IntArray b = a;
    b.fill(9);
    a.at(0) = 100;
    std::cout << a.sum() << ' ' << b.sum() << '\n';

    IntArray c(2, 5);
    c = c;
    std::cout << "self-assign ok: " << c.sum() << '\n';
    c = a;
    std::cout << c.sum() << ' ' << a.sum() << '\n';
}
```
关键点：拷贝赋值里「先 new 再 delete」保证任何时刻对象都持有一块有效内存；自赋值判断不可省，否则 delete[] 之后再去读 other.data_ 就是读已释放内存。at() 提供 const 与非 const 两个版本，让 const IntArray 也能只读访问。

</details>

#### 第 2 题 · 用 copy-and-swap 实现强异常安全（难度 3/3）

在上一题的 IntArray 基础上增加：
1) void swap(IntArray& other) noexcept：交换 n_ 与 data_；
2) 拷贝赋值改用 copy-and-swap 惯用法：先按值构造一个临时对象（借助已有的拷贝构造），再与 *this 交换；
3) 一个 free 函数 void swap(IntArray& a, IntArray& b) noexcept 调用成员版本。
验收：
- c = a 之后数据正确，且自赋值 c = c 不崩溃；
- 代码中 operator= 只有 3 行左右；
- 注释说明：为什么这种写法自动获得「强异常安全保证」和「自赋值安全」。

**提示**：写法是 IntArray& operator=(IntArray other) { swap(other); return *this; }——注意形参是按值传递（这就是「拷贝」步骤），函数返回时 other 析构，自动释放了本该释放的旧资源。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <utility>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : n_(n), data_(new int[n]) {
        std::fill(data_, data_ + n_, init);
    }
    IntArray(const IntArray& other) : n_(other.n_), data_(new int[other.n_]) {
        std::copy(other.data_, other.data_ + other.n_, data_);
    }
    IntArray& operator=(IntArray other) {   // 按值形参：拷贝在这里完成
        swap(other);                         // 接管副本的资源
        return *this;                        // other 析构，释放原有资源
    }
    ~IntArray() { delete[] data_; }

    void swap(IntArray& other) noexcept {
        std::swap(n_, other.n_);
        std::swap(data_, other.data_);
    }

    int& at(int i) { return data_[i]; }
    int size() const { return n_; }
    void fill(int v) { std::fill(data_, data_ + n_, v); }
    int sum() const {
        int s = 0;
        for (int i = 0; i < n_; ++i) s += data_[i];
        return s;
    }

private:
    int n_ = 0;
    int* data_ = nullptr;
};

void swap(IntArray& a, IntArray& b) noexcept { a.swap(b); }

int main() {
    IntArray a(4, 1);
    a.at(0) = 100;
    IntArray c(2, 5);
    c = c;                                  // 自赋值
    std::cout << "self: " << c.sum() << '\n';
    c = a;                                  // 赋值
    std::cout << c.sum() << ' ' << a.sum() << '\n';
    swap(c, a);
    std::cout << c.sum() << ' ' << a.sum() << '\n';
}
```
关键点：所有可能抛异常的分配与拷贝都发生在形参副本上，*this 只在最后做 noexcept 的 swap，因此要么完全成功、要么原对象一点没变（强异常安全）；自赋值天然安全，因为交换自己等于没换，之后临时对象析构掉的正是旧资源。

</details>

---

### 周三 · 运算符重载：+ == != 与 << —— 学习 / 1.5 小时

**今天学什么**

- 运算符重载的本质是函数调用：a + b 就是 operator+(a, b)，编译器只负责把它翻译成一次调用，因此「哪些运算符能重载、参数个数、优先级」都受语言规则约束（不能发明新运算符，不能改变优先级）。
- 成员还是非成员由「左操作数是否必须是你自己的类型」决定：operator<< 的左操作数是 std::ostream，所以几乎总要写成非成员；而 operator+= 修改左操作数，写成成员更自然。
- 返回类型的语义比语法更重要：+ 返回新对象（值），+= 返回 T&（支持 a += b += c），== 返回 bool 且应尽可能用 const 成员或非成员，且不应修改操作数。
- 一个易踩的坑：重载 == 不会自动带来 !=（C++17 也不自动），需要成对提供；但可以基于 == 实现 !=，保证两者逻辑永不矛盾。

**阅读**：《C++ Primer（第 5 版）》第 14 章 14.1 基本概念、14.2 输入和输出运算符、14.3 算术和关系运算符（14.3.1 相等运算符、14.3.2 关系运算符）、14.8.1 成员运算符、14.9 重载、类型转换与运算符；cppreference: operator overloading

**动手**

- 实现 Rational 类（分子、分母，构造时约分并保证分母为正），重载 operator+、operator-、operator==、operator!=、operator<<、operator+=。
- 给 Point 类加 operator<< 与 operator==，并在一个 vector<Point> 上用 std::find 查找某个点，验证 == 被调用。

**完成标准**

- [ ] 能解释为什么 operator<< 通常写成非成员函数
- [ ] 能说出 operator+ 与 operator+= 返回类型不同的原因
- [ ] Rational 的约分、负数、整数显示三种情况都测过

**课后题（2 道）**

#### 第 1 题 · Rational 分数类的算术与比较（难度 2/3）

实现 Rational 类：数据成员 long num_、long den_（private）。
- 构造函数 Rational(long n, long d = 1)：d 为 0 抛 std::invalid_argument；约分并保证 den_ > 0；
- operator+、operator-（成员，返回新对象）；
- operator+=（返回 Rational&）；
- operator==、operator!=（返回 bool，不修改操作数）；
- friend operator<< 输出最简形式，整数显示为 3 而不是 3/1。
验收：
```cpp
Rational a(1, 2), b(1, 3);
std::cout << a << " + " << b << " = " << (a + b) << '\n';   // 1/2 + 1/3 = 5/6
std::cout << (a - b) << ' ' << (a == b) << ' ' << (a != b) << '\n'; // 1/6 false true
Rational c(4, 2);
std::cout << c << '\n';                                     // 2
(a += b) += b;
std::cout << a << '\n';                                     // 7/6
```

**提示**：用 std::gcd（<numeric>）约分。加法通分：num = a.num*b.den + b.num*a.den，den = a.den*b.den，构造时统一约分。operator!= 直接 return !(*this == other); 避免逻辑分叉。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <numeric>
#include <stdexcept>

class Rational {
public:
    Rational(long n, long d = 1) : num_(n), den_(d) {
        if (d == 0) throw std::invalid_argument("分母不能为 0");
        normalize();
    }

    Rational operator+(const Rational& o) const {
        return Rational(num_ * o.den_ + o.num_ * den_, den_ * o.den_);
    }
    Rational operator-(const Rational& o) const {
        return Rational(num_ * o.den_ - o.num_ * den_, den_ * o.den_);
    }
    Rational& operator+=(const Rational& o) {
        *this = *this + o;
        return *this;
    }
    bool operator==(const Rational& o) const {
        return num_ == o.num_ && den_ == o.den_;   // 已约分，可直接比
    }
    bool operator!=(const Rational& o) const { return !(*this == o); }

    friend std::ostream& operator<<(std::ostream& os, const Rational& r);

private:
    void normalize() {
        if (den_ < 0) { den_ = -den_; num_ = -num_; }   // 负号放分子
        long g = std::gcd(num_ < 0 ? -num_ : num_, den_);
        if (g > 1) { num_ /= g; den_ /= g; }
    }
    long num_;
    long den_;
};

std::ostream& operator<<(std::ostream& os, const Rational& r) {
    if (r.den_ == 1) return os << r.num_;
    return os << r.num_ << '/' << r.den_;
}

int main() {
    Rational a(1, 2), b(1, 3);
    std::cout << a << " + " << b << " = " << (a + b) << '\n';
    std::cout << std::boolalpha;
    std::cout << (a - b) << ' ' << (a == b) << ' ' << (a != b) << '\n';
    std::cout << Rational(4, 2) << '\n';
    (a += b) += b;
    std::cout << a << '\n';
}
```
关键点：不变量的建立收在构造函数里（分母非零、约分、符号归位），于是 operator== 可以退化成成员逐一比较；operator+= 返回引用才能支持 (a += b) += b，而 operator+ 返回新值符合算术语义。

</details>

#### 第 2 题 · Point 的 == 与流输出，并用于 std::find（难度 2/3）

实现 Point 类（double x, y 私有）：
- Point(double x = 0, double y = 0)；
- operator==（精确比较即可，不必做浮点误差容忍）与 operator!=；
- friend operator<< 输出 (x, y) 形式，x/y 保留一位小数；
在 main 中构造 std::vector<Point>（含 (0,0)、(1.5,-2.0)、(3,4)），用 std::find 查找 (3,4) 并打印是否找到及其下标；再查找 (9,9) 验证返回 end()。

验证标准：输出明确区分「找到，下标=2」与「未找到」，并且编译时不需要为 Point 手写任何容器支持代码。

**提示**：std::find 需要 operator==，它会按顺序调用每个元素与目标的比较。输出小数点位数用 os << std::fixed << std::setprecision(1)（注意 include <iomanip>），但这会改变流的持久状态，可以只在本函数内设置。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <vector>

class Point {
public:
    Point(double x = 0, double y = 0) : x_(x), y_(y) {}
    double x() const { return x_; }
    double y() const { return y_; }

    bool operator==(const Point& o) const { return x_ == o.x_ && y_ == o.y_; }
    bool operator!=(const Point& o) const { return !(*this == o); }

    friend std::ostream& operator<<(std::ostream& os, const Point& p) {
        os << '(' << p.x_ << ", " << p.y_ << ')';
        return os;
    }

private:
    double x_, y_;
};

int main() {
    std::vector<Point> pts = {Point(0, 0), Point(1.5, -2.0), Point(3, 4)};

    auto report = [&](const Point& target) {
        auto it = std::find(pts.begin(), pts.end(), target);
        if (it == pts.end()) {
            std::cout << "未找到 " << target << '\n';
        } else {
            std::cout << "找到 " << *it << " 下标=" << (it - pts.begin()) << '\n';
        }
    };

    report(Point(3, 4));
    report(Point(9, 9));
}
```
关键点：算法只依赖语义契约——std::find 需要「能用 == 比较」，你的 Point 一旦提供了正确的 ==，就能直接放进标准算法而无需修改算法代码；operator<< 写成非成员友元是因为左操作数是 ostream。

</details>

---

### 周四 · 下标运算符与其他常用重载 —— 学习 / 1 小时

**今天学什么**

- operator[] 只能写成成员函数，并且应当成对提供 const 与非 const 两版：非 const 版返回 T& 允许写入，const 版返回 const T& 保证 const 对象不被改写。
- 下标语义由你的容器决定但要与用户预期一致：标准容器中 operator[] 不做边界检查（越界是未定义行为），而 at() 做检查并抛异常；自定义容器建议同时提供两者。
- 一元与二元、前缀与后缀自增都要区分：后缀版本多一个 int 哑参数，且应返回旧值（值语义），前缀版本返回引用；这是少数「必须照抄签名」的地方。
- 别滥用运算符重载：当语义不直观时（比如 operator+ 表示「合并两个数据库连接」）应改用普通具名函数，重载的目标是让代码更像内置类型，而不是更短。

**阅读**：《C++ Primer（第 5 版）》第 14 章 14.5 下标运算符、14.4 赋值运算符、14.6 递增和递减运算符、14.7 成员访问运算符、14.9.1 类型转换运算符；cppreference: operator_member_access, operator_incdec

**动手**

- 实现 Grid 类（二维 double 数组，用 std::vector<double> 扁平存储）：提供 double& at(int r, int c) 与 const 版本、非 const/const 的 operator[](int r) 返回行视图或行首指针（简化实现可以返回 std::vector<double> 的行拷贝并在注释里说明取舍）。
- 给 IntArray 增加前缀 ++ 与后缀 ++ 以外的实用重载：一元 operator-（返回所有元素取反的新对象），并测试 const 对象上调用。

**完成标准**

- [ ] 能说出 operator[] 为什么必须成对提供 const 与非 const 版本
- [ ] 能指出自定义容器的 [] 与 at() 在边界检查上的分工
- [ ] 能说出 operator+ 按值形参写法的优点

**课后题（2 道）**

#### 第 1 题 · 成对的 operator[] 与 at()（难度 2/3）

实现 IntArray（内部 int* 深拷贝三法则版本，可复用本周代码），要求：
- int& operator[](int i)：不做边界检查（与 std::vector 一致）；
- int& at(int i) 与 const int& at(int i) const：越界抛 std::out_of_range；
- int size() const；
- 非成员 operator==(const IntArray&, const IntArray&)：长度相同且逐元素相等才为 true。
验收：
```cpp
IntArray a(3, 1), b(3, 1), c(4, 1);
a[1] = 5;
std::cout << (a == b) << ' ' << (a == c) << ' ' << (b == b) << '\n';  // false false true
try { a.at(10) = 1; } catch (const std::out_of_range& e) { std::cout << "catch " << e.what() << '\n'; }
```

**提示**：operator== 写成非成员函数的好处是两侧操作数都能参与隐式转换、且写法对称；实现时先比较 size 再逐元素比较，注意用 at() 或下标但保证不越界（循环上界取 size 的较小者不需要，因为已判定相等）。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <stdexcept>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : n_(n), data_(new int[n]) {
        std::fill(data_, data_ + n_, init);
    }
    IntArray(const IntArray& o) : n_(o.n_), data_(new int[o.n_]) {
        std::copy(o.data_, o.data_ + o.n_, data_);
    }
    IntArray& operator=(const IntArray& o) {
        if (this == &o) return *this;
        int* fresh = new int[o.n_];
        std::copy(o.data_, o.data_ + o.n_, fresh);
        delete[] data_;
        data_ = fresh;
        n_ = o.n_;
        return *this;
    }
    ~IntArray() { delete[] data_; }

    int& operator[](int i) { return data_[i]; }          // 不检查
    const int& operator[](int i) const { return data_[i]; }

    int& at(int i) {
        check(i);
        return data_[i];
    }
    const int& at(int i) const {
        check(i);
        return data_[i];
    }
    int size() const { return n_; }

private:
    void check(int i) const {
        if (i < 0 || i >= n_) throw std::out_of_range("IntArray 下标越界");
    }
    int n_ = 0;
    int* data_ = nullptr;
};

bool operator==(const IntArray& a, const IntArray& b) {
    if (a.size() != b.size()) return false;
    for (int i = 0; i < a.size(); ++i)
        if (a[i] != b[i]) return false;
    return true;
}

int main() {
    IntArray a(3, 1), b(3, 1), c(4, 1);
    a[1] = 5;
    std::cout << std::boolalpha << (a == b) << ' ' << (a == c) << ' ' << (b == b) << '\n';
    try {
        a.at(10) = 1;
    } catch (const std::out_of_range& e) {
        std::cout << "catch " << e.what() << '\n';
    }
}
```
关键点：[] 保持与标准库一致的「快但不查」，at() 承担安全检查并抛异常，两者分工明确；operator== 作为非成员函数写法对称，且只依赖 operator[] 与 size()，不需要访问私有成员。

</details>

#### 第 2 题 · 一元取负与复合赋值（难度 3/3）

实现 Vec2 类（double x_, y_ 私有），重载：
- Vec2 operator-() const：返回逐分量取负的新对象（一元负号）；
- Vec2& operator+=(const Vec2&)：逐分量累加并返回 *this；
- friend Vec2 operator+(Vec2 lhs, const Vec2& rhs)：用「按值形参 + += 」实现（这是惯用写法）；
- friend std::ostream& operator<<。
验收：
```cpp
Vec2 a(1, 2), b(3, 4);
std::cout << (a + b) << '\n';    // (4, 6)
std::cout << (-a) << '\n';       // (-1, -2)
const Vec2 c(10, 20);
std::cout << (-c) << '\n';       // (-10, -20)  const 对象也能取负
std::cout << a << '\n';          // a 未被 + 修改
```

**提示**：operator+ 的第一个参数按值传递，于是函数体里直接改 lhs 并返回它，不需要先拷贝一份。operator- 是 const 成员函数，因此 const Vec2 也能调用。注意一元负号没有参数，与二元减法的参数个数不同，编译器靠这个区分。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

class Vec2 {
public:
    Vec2(double x = 0, double y = 0) : x_(x), y_(y) {}

    Vec2 operator-() const { return Vec2(-x_, -y_); }        // 一元负号
    Vec2& operator+=(const Vec2& o) {
        x_ += o.x_;
        y_ += o.y_;
        return *this;
    }

    friend Vec2 operator+(Vec2 lhs, const Vec2& rhs) {        // 按值形参即一份拷贝
        return lhs += rhs;
    }
    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
        return os << '(' << v.x_ << ", " << v.y_ << ')';
    }

private:
    double x_, y_;
};

int main() {
    Vec2 a(1, 2), b(3, 4);
    std::cout << (a + b) << '\n';
    std::cout << (-a) << '\n';
    const Vec2 c(10, 20);
    std::cout << (-c) << '\n';
    std::cout << a << '\n';
}
```
关键点：operator+ 用「按值第一参数 + 复用 +=」实现，代码只有一行且天然不修改操作数；operator- 声明为 const 成员函数，所以 const Vec2 也能参与运算——这是 const 正确性影响可用性的典型例子。

</details>

---

### 周五 · 移动构造与 std::move 入门 —— 学习 / 1.5 小时

**今天学什么**

- 右值引用 T&& 能绑定到临时对象（即将销毁的值），它的意义是告诉编译器「这个对象的资源可以被偷走」，从而避免深拷贝。
- 移动构造的典型实现是「偷指针 + 把源对象置空」：接管对方的资源，再把对方的指针设为 nullptr，保证源对象析构时不会误删已经转移的资源。
- std::move 本身不移动任何东西，它只是把左值强制转换成右值引用（相当于一次类型转换），真正的移动发生在随后的移动构造/移动赋值调用中；对 const 对象用 std::move 会退化成拷贝。
- 被移动之后的对象处于「有效但未指定」状态：可以安全地析构、可以重新赋值，但不要假设它的内容（比如不要读 vec.size() 的具体值）。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.6 对象移动（13.6.1 右值引用、13.6.2 移动构造函数和移动赋值运算符、13.6.3 右值引用和成员函数）；cppreference: move constructor, std::move

**动手**

- 给 IntArray 补上移动构造与移动赋值（noexcept，源对象置空），并写测试：std::move 之后源对象的 size() 为 0、目标对象数据正确。
- 写一个 std::vector<IntArray>，分别用 push_back(a)（拷贝）与 push_back(std::move(a))（移动），用 static 计数器统计拷贝次数与移动次数。

**完成标准**

- [ ] 能解释 std::move 只是类型转换、不产生任何移动动作
- [ ] 移动后的源对象能安全析构，且你知道它处于「有效但未指定」状态
- [ ] 能用实测数据说明 noexcept 对 vector 扩容行为的影响

**课后题（2 道）**

#### 第 1 题 · 给 IntArray 加移动构造与移动赋值（难度 3/3）

在 IntArray（深拷贝三法则版）基础上增加：
- IntArray(IntArray&& other) noexcept：接管 other.data_ 与 n_，把 other 置为 {nullptr, 0}；
- IntArray& operator=(IntArray&& other) noexcept：释放自身资源后接管，并处理自移动（this == &other）；
- 打印统计：static int copies，static int moves，在拷贝/移动构造函数里各自 ++。
验收：
```cpp
IntArray a(3, 7);
IntArray b = a;                 // 拷贝
IntArray c = std::move(a);      // 移动
std::cout << "copies=" << IntArray::copies() << " moves=" << IntArray::moves() << '\n'; // 1 1
std::cout << c.sum() << ' ' << a.size() << '\n';   // 21 0
a = std::move(c);               // 移动赋值
std::cout << a.sum() << ' ' << c.size() << '\n';   // 21 0
```

**提示**：移动构造的初始化列表直接写 n_(other.n_), data_(other.data_)，函数体里 other.data_ = nullptr; other.n_ = 0;。移动赋值里判断 this == &other 之后，先 delete[] 自己的 data_，再接管理权。标记 noexcept 很重要：vector 扩容时只对 noexcept 的移动构造放心使用。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <utility>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : n_(n), data_(new int[n]) {
        std::fill(data_, data_ + n_, init);
    }
    IntArray(const IntArray& o) : n_(o.n_), data_(new int[o.n_]) {
        std::copy(o.data_, o.data_ + o.n_, data_);
        ++copies_;
    }
    IntArray& operator=(const IntArray& o) {
        if (this == &o) return *this;
        int* fresh = new int[o.n_];
        std::copy(o.data_, o.data_ + o.n_, fresh);
        delete[] data_;
        data_ = fresh;
        n_ = o.n_;
        ++copies_;
        return *this;
    }
    IntArray(IntArray&& o) noexcept : n_(o.n_), data_(o.data_) {
        o.n_ = 0;
        o.data_ = nullptr;          // 源对象不再拥有资源
        ++moves_;
    }
    IntArray& operator=(IntArray&& o) noexcept {
        if (this == &o) return *this;
        delete[] data_;             // 释放自己的资源
        n_ = o.n_;
        data_ = o.data_;
        o.n_ = 0;
        o.data_ = nullptr;
        ++moves_;
        return *this;
    }
    ~IntArray() { delete[] data_; }

    int size() const { return n_; }
    int sum() const {
        int s = 0;
        for (int i = 0; i < n_; ++i) s += data_[i];
        return s;
    }
    static int copies() { return copies_; }
    static int moves() { return moves_; }

private:
    int n_ = 0;
    int* data_ = nullptr;
    inline static int copies_ = 0;
    inline static int moves_ = 0;
};

int main() {
    IntArray a(3, 7);
    IntArray b = a;
    IntArray c = std::move(a);
    std::cout << "copies=" << IntArray::copies() << " moves=" << IntArray::moves() << '\n';
    std::cout << c.sum() << ' ' << a.size() << '\n';
    a = std::move(c);
    std::cout << a.sum() << ' ' << c.size() << '\n';
}
```
关键点：移动构造「接管理指针并置空源对象」，所以移动后源对象 size()==0 且析构安全；noexcept 不是装饰，标准容器在扩容时是否采用移动而非拷贝，取决于移动构造是否声明为 noexcept。

</details>

#### 第 2 题 · 观察 vector 扩容时的拷贝与移动（难度 3/3）

用上一题的 IntArray（含 copies/moves 计数）：
1) 声明 std::vector<IntArray> v; 连续 push_back 临时对象（如 v.push_back(IntArray(1000, 1));）直到容量超过 4，打印 copies 与 moves 的变化趋势；
2) 换成 v.emplace_back(1000, 1); 重新统计，解释差异；
3) 把 IntArray 的移动构造临时改成「不写 noexcept」（在注释里说明这一步怎么做），观察扩容时 moves 与 copies 的变化，写下结论。

验证标准：你能用输出数据说明「移动构造是 noexcept 时，vector 扩容搬移旧元素走移动；否则可能退回拷贝」。

**提示**：vector 扩容需要把旧元素搬到新缓冲区：如果移动构造是 noexcept，它用移动；否则为了强异常安全只能用拷贝。reserve 一下可以让扩容次数变成 0，对比起来更清楚。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : n_(n), data_(new int[n]) {
        std::fill(data_, data_ + n_, init);
    }
    IntArray(const IntArray& o) : n_(o.n_), data_(new int[o.n_]) {
        std::copy(o.data_, o.data_ + o.n_, data_);
        ++copies_;
    }
    IntArray& operator=(const IntArray& o) {
        if (this == &o) return *this;
        int* fresh = new int[o.n_];
        std::copy(o.data_, o.data_ + o.n_, fresh);
        delete[] data_;
        data_ = fresh;
        n_ = o.n_;
        ++copies_;
        return *this;
    }
    // 试着删掉下面的 noexcept，观察扩容时是否退化成拷贝
    IntArray(IntArray&& o) noexcept : n_(o.n_), data_(o.data_) {
        o.n_ = 0;
        o.data_ = nullptr;
        ++moves_;
    }
    IntArray& operator=(IntArray&& o) noexcept {
        if (this == &o) return *this;
        delete[] data_;
        n_ = o.n_;
        data_ = o.data_;
        o.n_ = 0;
        o.data_ = nullptr;
        ++moves_;
        return *this;
    }
    ~IntArray() { delete[] data_; }

    static int copies() { return copies_; }
    static int moves() { return moves_; }
    static void reset() { copies_ = moves_ = 0; }

private:
    int n_ = 0;
    int* data_ = nullptr;
    inline static int copies_ = 0;
    inline static int moves_ = 0;
};

int main() {
    {
        std::vector<IntArray> v;
        for (int i = 0; i < 6; ++i) v.push_back(IntArray(100, 1));
        std::cout << "push_back(temp): copies=" << IntArray::copies()
                  << " moves=" << IntArray::moves() << " cap=" << v.capacity() << '\n';
    }
    IntArray::reset();
    {
        std::vector<IntArray> v;
        for (int i = 0; i < 6; ++i) v.emplace_back(100, 1);
        std::cout << "emplace_back:    copies=" << IntArray::copies()
                  << " moves=" << IntArray::moves() << " cap=" << v.capacity() << '\n';
    }
    IntArray::reset();
    {
        std::vector<IntArray> v;
        v.reserve(6);
        for (int i = 0; i < 6; ++i) v.emplace_back(100, 1);
        std::cout << "with reserve:    copies=" << IntArray::copies()
                  << " moves=" << IntArray::moves() << '\n';
    }
}
```
关键点：push_back(临时对象) 每次要多一次移动（临时对象搬进容器），emplace_back 直接在容器内存里构造，省掉这一次；扩容搬移旧元素的数量取决于容量增长策略，而 reserve 提前要够空间可以让扩容搬移归零。把移动构造的 noexcept 去掉后，标准库因无法保证强异常安全会改用拷贝，moves 下降、copies 上升。

</details>

---

### 周六 · 项目日：手写动态数组 IntVec —— 项目 / 2 小时

**今天学什么**

- 把三法则/五法则落到一个真实容器上：IntVec 需要容量与大小分离（capacity/size）、扩容策略、以及五个特殊成员函数的正确配合。
- 扩容是深拷贝与移动的分界点：扩容把旧缓冲区元素搬到新缓冲区，优先用移动（要求移动构造 noexcept），搬完要正确释放旧缓冲区并更新指针。
- 容器的接口设计要与标准库保持心智一致：size()/capacity()/empty()/clear()/push_back()/pop_back()/at()，让用户凭已有经验就能用对。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.5 动态内存管理类（StrVec 示例，13.5 节整节）、13.1.4 三/五法则

**动手**

- 实现 IntVec 的骨架：size_/capacity_/data_ 三个成员，默认构造、explicit IntVec(int n) 构造、析构、拷贝构造、拷贝赋值、移动构造、移动赋值。
- 实现 reserve(int newCap)：容量不足时申请新缓冲区、搬移（用 std::move_if_noexcept 或手工循环）、释放旧缓冲区；push_back 在满时按 2 倍扩容。

**完成标准**

- [ ] IntVec 的六项验收全部通过，且没有内存错误（可用 -fsanitize=address 或 Debug 模式验证）
- [ ] 能手写五法则的五个函数签名，并说明每个函数里的关键三步
- [ ] 能解释 size 与 capacity 分离带来的性能收益

**课后题（2 道）**

#### 第 1 题 · IntVec 完整实现（五法则 + 扩容）（难度 3/3）

实现 IntVec（只用裸指针管理内存，不允许内部直接用 std::vector 存数据）：
- 构造：IntVec()、explicit IntVec(int n, int init = 0)；
- 析构、拷贝构造、拷贝赋值、移动构造、移动赋值（移动版本 noexcept）；
- 容量与访问：int size() const、int capacity() const、bool empty() const、int& at(int i)（越界抛 std::out_of_range）、int& operator[](int i) 与非 const 版本；
- 修改：void push_back(int v)（满则容量翻倍，初始容量 4）、void pop_back()（空则抛 std::out_of_range）、void clear()（size_ 置 0，不释放内存）、void reserve(int cap)；
- 非成员 operator==：大小相同且逐元素相等。
验收（必须全部满足）：
1) 连续 push_back 20 个元素后 size()==20，且打印每个元素正确；
2) capacity() 的取值序列符合翻倍策略（打印容量变化）；
3) `IntVec b = a; b.push_back(99);` 后 a 不受影响；
4) `IntVec c = std::move(a);` 后 c 数据完整、a.size()==0；
5) `v = v;` 自赋值不崩溃且内容不变；
6) at(100) 抛出并捕获 std::out_of_range。

**提示**：把「申请新缓冲区 + 搬移 + 释放旧缓冲区」抽成 private 的 void reallocate(int newCap)，push_back 与 reserve 都调用它；拷贝赋值沿用「先申请新内存再释放旧内存」或 copy-and-swap；移动赋值记得判自移动并先释放自身资源。clear() 只重置 size_，capacity_ 与 data_ 保持不变。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <stdexcept>
#include <utility>

class IntVec {
public:
    IntVec() = default;
    explicit IntVec(int n, int init = 0) : size_(n), cap_(n), data_(new int[n]) {
        std::fill(data_, data_ + n, init);
    }
    IntVec(const IntVec& o) : size_(o.size_), cap_(o.size_), data_(o.size_ ? new int[o.size_] : nullptr) {
        std::copy(o.data_, o.data_ + o.size_, data_);
    }
    IntVec& operator=(const IntVec& o) {
        if (this == &o) return *this;
        int* fresh = o.size_ ? new int[o.size_] : nullptr;
        std::copy(o.data_, o.data_ + o.size_, fresh);
        delete[] data_;
        data_ = fresh;
        size_ = cap_ = o.size_;
        return *this;
    }
    IntVec(IntVec&& o) noexcept : size_(o.size_), cap_(o.cap_), data_(o.data_) {
        o.size_ = o.cap_ = 0;
        o.data_ = nullptr;
    }
    IntVec& operator=(IntVec&& o) noexcept {
        if (this == &o) return *this;
        delete[] data_;
        size_ = o.size_;
        cap_ = o.cap_;
        data_ = o.data_;
        o.size_ = o.cap_ = 0;
        o.data_ = nullptr;
        return *this;
    }
    ~IntVec() { delete[] data_; }

    int size() const { return size_; }
    int capacity() const { return cap_; }
    bool empty() const { return size_ == 0; }

    int& at(int i) {
        check(i);
        return data_[i];
    }
    const int& at(int i) const {
        check(i);
        return data_[i];
    }
    int& operator[](int i) { return data_[i]; }
    const int& operator[](int i) const { return data_[i]; }

    void reserve(int cap) {
        if (cap > cap_) reallocate(cap);
    }
    void push_back(int v) {
        if (size_ == cap_) reallocate(cap_ == 0 ? 4 : cap_ * 2);
        data_[size_++] = v;
    }
    void pop_back() {
        if (size_ == 0) throw std::out_of_range("pop_back on empty");
        --size_;
    }
    void clear() { size_ = 0; }

    friend bool operator==(const IntVec& a, const IntVec& b) {
        if (a.size_ != b.size_) return false;
        for (int i = 0; i < a.size_; ++i)
            if (a.data_[i] != b.data_[i]) return false;
        return true;
    }

private:
    void check(int i) const {
        if (i < 0 || i >= size_) throw std::out_of_range("IntVec 下标越界");
    }
    void reallocate(int newCap) {
        int* fresh = new int[newCap];
        for (int i = 0; i < size_; ++i) fresh[i] = std::move(data_[i]);   // 对 int 等价于拷贝，对重类型才是移动
        delete[] data_;
        data_ = fresh;
        cap_ = newCap;
    }

    int size_ = 0;
    int cap_ = 0;
    int* data_ = nullptr;
};

int main() {
    IntVec v;
    for (int i = 0; i < 20; ++i) {
        v.push_back(i * i);
        std::cout << "push " << i << " size=" << v.size() << " cap=" << v.capacity() << '\n';
    }
    std::cout << std::boolalpha;

    IntVec a;
    for (int i = 0; i < 3; ++i) a.push_back(i);
    IntVec b = a;
    b.push_back(99);
    std::cout << "deep copy: " << (a.size() == 3) << ' ' << (b.size() == 4) << '\n';

    IntVec c = std::move(a);
    std::cout << "moved: " << (c.size() == 3) << ' ' << (a.size() == 0) << '\n';

    c = c;
    std::cout << "self assign: " << c.size() << '\n';

    try {
        c.at(100) = 1;
    } catch (const std::out_of_range& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
}
```
关键点：size 与 capacity 分离是容器性能的基础——push_back 均摊 O(1) 靠的是翻倍扩容而不是每次加 1；五个特殊成员函数必须成套正确，尤其移动版本要把源对象置空、拷贝赋值要先申请后释放，才能避免泄漏与自赋值崩溃。

</details>

#### 第 2 题 · 给 IntVec 加上 insert 与 erase（难度 3/3）

在上一题的 IntVec 上扩展：
- void insert(int pos, int v)：在位置 pos 插入（0 <= pos <= size()，越界抛 std::out_of_range），pos 及其后的元素整体后移一位；
- void erase(int pos)：删除位置 pos 的元素（越界抛 std::out_of_range），后面的元素前移；
- friend std::ostream& operator<<(std::ostream&, const IntVec&) 输出 [1, 2, 3] 形式。
验收：
```cpp
IntVec v;
for (int i = 1; i <= 5; ++i) v.push_back(i);
v.insert(2, 99);      // [1, 2, 99, 3, 4, 5]
v.erase(0);           // [2, 99, 3, 4, 5]
std::cout << v << '\n';
v.insert(5, 77);      // 追加到末尾
std::cout << v << '\n';    // [2, 99, 3, 4, 5, 77]
```
注意：插入时需要保证容量足够（不足则扩容），并注意元素后移必须从后往前搬，否则会覆盖数据。

**提示**：insert 先判断 pos 是否合法、必要时 reserve（cap_ * 2 或 size_ + 1），然后从 size_ 开始向前把 data_[i-1] 写到 data_[i]，最后写入 v 并 ++size_。erase 从 pos 开始向后搬移，最后 --size_。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <stdexcept>
#include <utility>

class IntVec {
public:
    IntVec() = default;
    explicit IntVec(int n, int init = 0) : size_(n), cap_(n), data_(n ? new int[n] : nullptr) {
        std::fill(data_, data_ + n, init);
    }
    IntVec(const IntVec& o) : size_(o.size_), cap_(o.size_), data_(o.size_ ? new int[o.size_] : nullptr) {
        std::copy(o.data_, o.data_ + o.size_, data_);
    }
    IntVec& operator=(const IntVec& o) {
        if (this == &o) return *this;
        int* fresh = o.size_ ? new int[o.size_] : nullptr;
        std::copy(o.data_, o.data_ + o.size_, fresh);
        delete[] data_;
        data_ = fresh;
        size_ = cap_ = o.size_;
        return *this;
    }
    IntVec(IntVec&& o) noexcept : size_(o.size_), cap_(o.cap_), data_(o.data_) {
        o.size_ = o.cap_ = 0;
        o.data_ = nullptr;
    }
    IntVec& operator=(IntVec&& o) noexcept {
        if (this == &o) return *this;
        delete[] data_;
        size_ = o.size_;
        cap_ = o.cap_;
        data_ = o.data_;
        o.size_ = o.cap_ = 0;
        o.data_ = nullptr;
        return *this;
    }
    ~IntVec() { delete[] data_; }

    int size() const { return size_; }
    int capacity() const { return cap_; }
    int& at(int i) {
        check(i);
        return data_[i];
    }
    int& operator[](int i) { return data_[i]; }
    const int& operator[](int i) const { return data_[i]; }

    void reserve(int cap) {
        if (cap > cap_) reallocate(cap);
    }
    void push_back(int v) {
        if (size_ == cap_) reallocate(cap_ == 0 ? 4 : cap_ * 2);
        data_[size_++] = v;
    }
    void insert(int pos, int v) {
        if (pos < 0 || pos > size_) throw std::out_of_range("insert 位置越界");
        if (size_ == cap_) reallocate(cap_ == 0 ? 4 : cap_ * 2);
        for (int i = size_; i > pos; --i) data_[i] = data_[i - 1];   // 从后往前搬
        data_[pos] = v;
        ++size_;
    }
    void erase(int pos) {
        check(pos);
        for (int i = pos; i + 1 < size_; ++i) data_[i] = data_[i + 1];
        --size_;
    }

    friend std::ostream& operator<<(std::ostream& os, const IntVec& v) {
        os << '[';
        for (int i = 0; i < v.size_; ++i) {
            if (i) os << ", ";
            os << v.data_[i];
        }
        return os << ']';
    }

private:
    void check(int i) const {
        if (i < 0 || i >= size_) throw std::out_of_range("IntVec 下标越界");
    }
    void reallocate(int newCap) {
        int* fresh = new int[newCap];
        std::copy(data_, data_ + size_, fresh);
        delete[] data_;
        data_ = fresh;
        cap_ = newCap;
    }

    int size_ = 0;
    int cap_ = 0;
    int* data_ = nullptr;
};

int main() {
    IntVec v;
    for (int i = 1; i <= 5; ++i) v.push_back(i);
    v.insert(2, 99);
    v.erase(0);
    std::cout << v << '\n';
    v.insert(v.size(), 77);
    std::cout << v << '\n';
    try {
        v.insert(999, 1);
    } catch (const std::out_of_range& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
}
```
关键点：插入元素时必须在搬移之前确保容量足够，否则会写越界；后移必须从最后一个元素开始向前搬，前移必须从 pos 开始向后搬，方向反了就会自我覆盖。允许 pos == size() 的 insert 等价于 push_back，这是标准库也遵循的约定。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回看本周代码，把「什么时候必须自己写拷贝控制」「三法则与五法则的差别」两条用自己的话重写一遍。

**阅读**：《C++ Primer（第 5 版）》第 13 章小结、14.1 基本概念（回顾运算符重载的边界）

**动手**

- 可选任务：为本周的 IntVec 补一个 std::string 版本的 StringVec（把 int 换成 std::string），体会移动语义在非平凡类型上的收益（用拷贝/移动计数对比）。

**完成标准**

- [ ] 三种类的特殊成员函数判断与理由都已写下
- [ ] 能一句话说出「需要自己写拷贝控制的唯一判据」

**课后题（1 道）**

#### 第 1 题 · 轻量自测：这个类该写哪几个特殊成员函数（难度 2/3）

针对下面三种类，分别指出需要手写哪几个特殊成员函数（析构/拷贝构造/拷贝赋值/移动构造/移动赋值），并各写一句理由。
1) class Config { std::string path_; int timeout_; };  
2) class FileHandle { FILE* fp_; };（构造 fopen、析构 fclose）
3) class Session { std::shared_ptr<Connection> conn_; };
把这些结论写成 C++ 注释贴在代码里，并给每个类补上你认为正确的声明（= default 或 = delete 或自定义）。

**提示**：判断标准只有一条：类是否「拥有」一份需要手工释放的资源。拥有裸资源必须自己管（三法则），不拥有则一律交给编译器；拥有独占资源时通常还应禁止拷贝或提供移动。

<details>
<summary>参考答案</summary>

```cpp
#include <cstdio>
#include <memory>
#include <string>

// 1) 不拥有资源：全部交给编译器
class Config {
public:
    Config() = default;
    Config(const Config&) = default;
    Config& operator=(const Config&) = default;
    ~Config() = default;
private:
    std::string path_;
    int timeout_ = 0;
};

// 2) 独占裸资源：三法则 + 禁止拷贝（或实现深拷贝）+ 允许移动
class FileHandle {
public:
    explicit FileHandle(const char* path) : fp_(std::fopen(path, "r")) {}
    ~FileHandle() { if (fp_) std::fclose(fp_); }
    FileHandle(const FileHandle&) = delete;              // 句柄不该被复制
    FileHandle& operator=(const FileHandle&) = delete;
    FileHandle(FileHandle&& o) noexcept : fp_(o.fp_) { o.fp_ = nullptr; }
    FileHandle& operator=(FileHandle&& o) noexcept {
        if (this == &o) return *this;
        if (fp_) std::fclose(fp_);
        fp_ = o.fp_;
        o.fp_ = nullptr;
        return *this;
    }
    bool valid() const { return fp_ != nullptr; }
private:
    FILE* fp_ = nullptr;
};

// 3) 共享所有权：shared_ptr 自己管计数，五个都交给编译器
class Session {
public:
    Session() = default;
    Session(const Session&) = default;
    Session& operator=(const Session&) = default;
    Session(Session&&) = default;
    Session& operator=(Session&&) = default;
    ~Session() = default;
private:
    std::shared_ptr<int> conn_;      // 用 int 代替 Connection 以便本文件可编译
};

int main() {
    Config c;
    FileHandle f("不存在的文件.txt");
    Session s;
    (void)c; (void)f; (void)s;
    return 0;
}
```
关键点：判断依据不是「类里有什么成员」，而是「谁负责释放」——裸指针拥有资源就得自己写三法则并考虑移动；一旦成员自己就是 RAII 类型（string、vector、shared_ptr），默认版本反而是最正确的选择。禁止拷贝的独占资源类必须提供移动，否则连放进容器都做不到。

</details>

---

## 第 3 周 · 继承与多态

**本周目标**：从「复制粘贴代码」升级到「通过接口编程」：能用继承表达 is-a 关系，理解动态绑定发生的确切条件，写出带虚析构的抽象基类，并在需要时用 RTTI 安全地识别真实类型。

### 周一 · 继承基础与访问控制 —— 学习 / 1.5 小时

**今天学什么**

- 继承表达 is-a：派生类对象「是一个」基类对象，因此可以把派生类对象的地址/引用交给接受基类的代码，这个替换能力（里氏替换）是继承唯一真正的价值。
- public 继承保留了基类的访问级别（public 仍是 public、protected 仍是 protected），而 protected/private 继承会把它们降级——后两者表达的是「用基类实现」而非「是基类」，90% 的场景应该用 public。
- protected 成员对派生类是可见的，但它把封装撕开了一道口子：凡是能写成 private + 提供 protected 访问函数的，就不要直接暴露 protected 数据成员。
- 构造与析构的顺序是「基类先构造、派生类后构造；派生类先析构、基类后析构」——因为派生类可能依赖基类已经就绪的那部分，反向顺序会让基类在派生类还在用时先消失。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.1 OOP 概述、15.2 定义基类和派生类（15.2.1 定义基类、15.2.2 定义派生类、15.2.3 类型转换与继承、15.2.4 派生类构造函数）、15.5 访问控制与继承（15.5 节整节）；cppreference: derived class

**动手**

- 写 Base（public 函数 show、protected int count_、private int secret_）与 Derived（成员函数中访问 count_，并在注释里写清访问 secret_ 会编译失败）。
- 在 Base 与 Derived 的构造/析构函数中各打印一行，观察输出顺序并画出生构造-析构的生命周期时间线。

**完成标准**

- [ ] 能说出 public/protected/private 三种继承方式对基类成员访问级别的影响
- [ ] 能默写构造与析构的调用顺序并解释原因
- [ ] 两题都能编译运行，且代码里保留了 private 访问失败的编译错误信息

**课后题（2 道）**

#### 第 1 题 · 基类与派生类的访问边界（难度 1/3）

实现：
- Base：protected 的 int count_ = 0，private 的 int secret_ = 42，public 的 void show() const 打印 count_ 与 secret_，public 的 void bump() 把 count_ 加 1。
- Derived : public Base：public 的 void grow() 把 count_ 加 10（证明 protected 对派生类可见）；在函数体里写一行 count_ 之外的 `secret_ = 1;` 并**用注释保留**编译器报错信息。
- Derived 的构造函数与析构函数各打印一行，Base 的构造与析构也各打印一行。
在 main 中创建 Derived 对象，调用 show() 与 grow() 后打印 count_ 的最终值。

验证标准：输出顺序为「base ctor → derived ctor →（使用）→ derived dtor → base dtor」，且注释中记录了 private 成员不可访问的编译错误。

**提示**：在成员函数里可以直接用成员名（count_），因为派生类的成员函数作用域内能查找到基类的 protected 成员。想验证「派生类外不能访问 protected」，可以在 main 里写一句 d.count_ = 1;，同样会编译失败。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

class Base {
public:
    Base() { std::cout << "base ctor\n"; }
    ~Base() { std::cout << "base dtor\n"; }

    void bump() { ++count_; }
    void show() const { std::cout << "count_=" << count_ << " secret_=" << secret_ << '\n'; }

protected:
    int count_ = 0;      // 派生类可访问

private:
    int secret_ = 42;    // 派生类也不可访问
};

class Derived : public Base {
public:
    Derived() { std::cout << "derived ctor\n"; }
    ~Derived() { std::cout << "derived dtor\n"; }

    void grow() {
        count_ += 10;    // OK：protected 对派生类可见
        // secret_ = 1;  // error C2248: "Base::secret_": 无法访问 private 成员
    }
};

int main() {
    Derived d;
    d.bump();
    d.grow();
    d.show();
    // d.count_ = 1;     // error C2248: protected 成员只能被本类/派生类访问
    std::cout << "main 结束\n";
}
```
关键点：public 继承让「派生类对象」可以直接当作基类对象使用，而 protected 只向派生类的成员函数开门，向使用者的代码关门；构造/析构顺序保证基类部分在派生类存在期间始终有效。

</details>

#### 第 2 题 · 银行支付方式：用派生类复用基类逻辑（难度 2/3）

实现支付体系：
- 基类 Payment：protected double balanceLimit_；构造函数 Payment(double limit) 校验 limit > 0 否则抛 std::invalid_argument；public 的 virtual double remaining() const 返回剩余额度（本日先用 virtual 引出话题也可以，但重点在复用逻辑）；public 的 bool pay(double amount)：amount<=0 或超过剩余额度返回 false，否则扣减并返回 true；protected 的 double used_ 记录已用额度。
- 派生类 CreditPayment : public Payment：额外成员 double monthlyBudget_，构造函数 CreditPayment(double limit, double budget) 转发给基类并校验 budget>0；提供 bool canAfford(double amount) const（amount>0 且 amount <= monthlyBudget_ 且 amount <= remaining()）；提供 void resetBudget(double b)。
- 派生类 DebitPayment : public Payment：额外成员 int freeTransactions_，构造函数 DebitPayment(double limit, int freeTx)；覆盖 pay(double)（用 override）：每次支付前若 freeTransactions_<=0 则额外扣除 1.0 手续费（不足则失败），否则 freeTransactions_ 减 1。
验收：
```cpp
CreditPayment c(500, 200);
std::cout << c.canAfford(150) << ' ' << c.pay(150) << ' ' << c.remaining() << '\n';  // true true 350
DebitPayment d(100, 1);
std::cout << d.pay(50) << ' ' << d.remaining() << '\n';   // true 50
std::cout << d.pay(10) << ' ' << d.remaining() << '\n';   // true 39（10 + 1 手续费）
```

**提示**：pay 在基类里已经实现了「额度校验 + 扣减 + 记录」，派生类要新增规则时应尽量复用：DebitPayment::pay 里可以先调用基类版本（Payment::pay(amount + fee) 或先判手续费），不要在派生类里重新写一遍额度逻辑。构造函数转发写 `: Payment(limit)`。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>

class Payment {
public:
    explicit Payment(double limit) : balanceLimit_(limit) {
        if (limit <= 0) throw std::invalid_argument("额度必须为正");
    }
    virtual ~Payment() = default;

    virtual bool pay(double amount) {
        if (amount <= 0 || amount > remaining()) return false;
        used_ += amount;
        return true;
    }
    double remaining() const { return balanceLimit_ - used_; }

protected:
    double balanceLimit_;
    double used_ = 0.0;
};

class CreditPayment : public Payment {
public:
    CreditPayment(double limit, double budget) : Payment(limit), monthlyBudget_(budget) {
        if (budget <= 0) throw std::invalid_argument("月度预算必须为正");
    }
    bool canAfford(double amount) const {
        return amount > 0 && amount <= monthlyBudget_ && amount <= remaining();
    }
    void resetBudget(double b) { monthlyBudget_ = b; }

private:
    double monthlyBudget_;
};

class DebitPayment : public Payment {
public:
    DebitPayment(double limit, int freeTx) : Payment(limit), freeTransactions_(freeTx) {}

    bool pay(double amount) override {
        if (amount <= 0) return false;
        if (freeTransactions_ > 0) {
            if (!Payment::pay(amount)) return false;   // 复用基类规则
            --freeTransactions_;
            return true;
        }
        if (!Payment::pay(amount + 1.0)) return false; // 含 1.0 手续费
        return true;
    }

private:
    int freeTransactions_;
};

int main() {
    std::cout << std::boolalpha;
    CreditPayment c(500, 200);
    std::cout << c.canAfford(150) << ' ' << c.pay(150) << ' ' << c.remaining() << '\n';

    DebitPayment d(100, 1);
    std::cout << d.pay(50) << ' ' << d.remaining() << '\n';
    std::cout << d.pay(10) << ' ' << d.remaining() << '\n';
}
```
关键点：额度校验、扣减、剩余计算都留在基类，派生类只负责新增规则（手续费/预算），这就是继承带来的代码复用；DebitPayment::pay 显式调用 Payment::pay() 而不是重写一遍额度逻辑，避免两份实现逐渐漂移。

</details>

---

### 周二 · 构造转发、名字隐藏与对象切片 —— 学习 / 1.5 小时

**今天学什么**

- 派生类构造函数必须在初始化列表里把基类部分构造好（Base(arg)），因为基类子对象总是先于派生类成员构造；不写就调用基类默认构造，没有默认构造时直接编译失败。
- 派生类里同名的函数会隐藏基类的**全部**同名重载（不是覆盖、也不是重载），要用 using Base::foo; 把基类版本引入派生类作用域，否则 base 版本会被静默拒绝。
- 对象切片是「按值传递基类」造成的：Derived 对象被截断成 Base 子对象，派生部分被丢弃，这是把多态对象按值传递的必然结果。
- 因此多态对象必须以引用或指针传递（Base& / Base*），按值传递既会切片又可能造成不必要的拷贝——这是初学继承最常见的事故。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.2.4 派生类构造函数、15.2.3 类型转换与继承、15.6 继承中的作用域（名字查找与隐藏）、15.3 虚函数（为周三铺垫）；cppreference: using declaration, object slicing

**动手**

- 写 Printer（重载 write(const std::string&) 与 write(const std::string&, int)）与 ColorPrinter : public Printer，先不加 using 触发隐藏，再加上 using Printer::write; 让两个版本都可用。
- 写一个按值接收基类的函数 void render(Base b) 与按引用接收的 void renderRef(const Base& b)，用 Derived 对象调用两者，对比输出并解释差异。

**完成标准**

- [ ] 能解释名字隐藏在什么情况下发生、using 声明如何解决
- [ ] 能指出对象切片发生在哪一行代码、为什么无法补救
- [ ] 知道多态对象应当用引用/指针/unique_ptr 传递，而不是按值

**课后题（2 道）**

#### 第 1 题 · 用 using 解开名字隐藏（难度 2/3）

实现：
- Printer：public 的 void write(const std::string& s) 打印 "print: " + s；public 的 void write(const std::string& s, int times) 重复打印 times 次。
- ColorPrinter : public Printer：新增 public 的 void write(const std::string& s, const std::string& color) 打印 "[color] s"。
步骤：
1) 先不写 using，在 main 里调用 cp.write("hi") 与 cp.write("hi", 3)，把编译器报错用注释保留；
2) 加上 using Printer::write; 后两者都能编译，并说明为什么第三种重载仍然可用。

验证标准：加 using 后三行调用全部输出正确；注释里说明「派生类的同名函数隐藏基类全部重载」这一点。

**提示**：名字查找先从派生类作用域找，一旦在 ColorPrinter 里找到了 write，查找就停止，不会再去 Printer 找同名函数——这就是隐藏。using Printer::write; 相当于把基类的这些重载「搬进」派生类的作用域，与新的重载共同参与重载决议。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Printer {
public:
    void write(const std::string& s) { std::cout << "print: " << s << '\n'; }
    void write(const std::string& s, int times) {
        for (int i = 0; i < times; ++i) std::cout << "print: " << s << '\n';
    }
};

class ColorPrinter : public Printer {
public:
    using Printer::write;   // 把基类的 write 重载集合引入本作用域

    void write(const std::string& s, const std::string& color) {
        std::cout << '[' << color << "] " << s << '\n';
    }
};

int main() {
    ColorPrinter cp;
    // 没有 using 时：
    // cp.write("hi");        // error C2661: 没有接受 1 个参数的重载函数
    // cp.write("hi", 3);     // error C2664: 无法将参数 2 从 int 转换为 const std::string&
    cp.write("hi");
    cp.write("hi", 3);
    cp.write("hi", "red");
}
```
关键点：派生类中同名函数会隐藏基类全部同名重载（与参数列表无关），加 using 声明即可让它们共同参与重载决议；三种调用分别命中基类的两个重载与派生类的新重载。

</details>

#### 第 2 题 · 现场制造并消灭对象切片（难度 2/3）

实现：
- Base：成员 std::string tag_ = "base"; 与 public 的 virtual std::string describe() const 返回 tag_ + " / describe";
- Derived : public Base：构造函数把 tag_ 设为 "derived"（需要把 tag_ 放在 protected 或提供 protected setter）。
在 main 中：
1) 写 void byValue(Base b) 与 void byRef(const Base& b)，函数体都打印 b.describe()；
2) 用 Derived 对象分别调用两者，把两个输出写在注释里并解释差异；
3) 再写一行注释说明：为什么 std::vector<Base> 里放 Derived 会丢失派生信息，正确做法是什么。

验证标准：byValue 输出 base 的 describe，byRef 输出 derived 的 describe，且你能说清「切片发生在拷贝那一刻」。

**提示**：byValue 的参数是一个 Base 类型对象，传参时只用 Base 部分的拷贝构造来创建它，vptr 也变成 Base 的，所以之后无论怎么调用都只能是 Base 的行为。byRef 不创建新对象，动态类型仍是 Derived。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>

class Base {
public:
    virtual ~Base() = default;
    virtual std::string describe() const { return tag_ + " / describe"; }

protected:
    std::string tag_ = "base";
};

class Derived : public Base {
public:
    Derived() { tag_ = "derived"; }
    std::string describe() const override { return tag_ + " / describe(overridden)"; }
};

void byValue(Base b) { std::cout << "byValue:  " << b.describe() << '\n'; }
void byRef(const Base& b) { std::cout << "byRef:    " << b.describe() << '\n'; }

int main() {
    Derived d;
    byValue(d);   // byValue:  base / describe          —— 派生部分已被切掉
    byRef(d);     // byRef:    derived / describe(overridden)

    // std::vector<Base> v; v.push_back(d);  // 同样把 d 切成 Base，派生信息丢失
    // 正确做法：容器存指针或智能指针，保持多态
    std::vector<Base*> vp;
    vp.push_back(&d);
    std::cout << "via pointer: " << vp[0]->describe() << '\n';
}
```
关键点：切片发生在「按值拷贝构造一个 Base 对象」的那一刻，此刻派生类特有的数据与虚表指针都被丢弃，此后无法恢复；多态对象一律用引用或指针传参，容器则用 unique_ptr<Base>。

</details>

---

### 周三 · 虚函数与动态绑定 —— 学习 / 1.5 小时

**今天学什么**

- 动态绑定的两个必要条件：函数必须是 virtual，而且必须通过基类的指针或引用调用；直接对对象调用（obj.f()）永远是静态绑定，编译期就定死了。
- 静态类型是变量声明时的类型（编译期），动态类型是运行期真正指向的对象类型；只有动态类型才能决定虚函数调用哪一个实现。
- 非虚函数通过基类指针调用绝不会分发到派生类实现，所以「接口需要被重写的行为」必须标 virtual，而「不该被改动的固定流程」应保持非虚。
- 虚函数的代价是一次间接调用（无法内联展开），换来的是「调用方只依赖接口、不依赖具体类型」的可扩展性——新增派生类不需要修改任何既有调用代码。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.3 虚函数（15.3 节整节）、15.2.3 类型转换与继承、15.4 抽象基类（先读，为周五铺垫）；cppreference: virtual function, virtual function specifier

**动手**

- 写 Character 基类（非虚的 id() 与虚的 attack()）与 Warrior、Mage 两个派生类，分别用「对象直接调用」「基类指针调用」「基类引用调用」三种方式观察输出差异。
- 写一个函数 void round(const std::vector<Character*>& team)，对每个角色调用 attack() 并累加伤害，验证新增一个派生类时该函数一行都不用改。

**完成标准**

- [ ] 能说出动态绑定必须同时满足的两个条件
- [ ] 能解释静态类型与动态类型的区别，并举出至少一处本日代码中的例子
- [ ] 能说明多态带来的「扩展不需要改调用方」的优势

**课后题（2 道）**

#### 第 1 题 · 对比非虚函数与虚函数的分发（难度 2/3）

实现：
- Character：public 的 std::string name() const（**非虚**，返回固定字符串 "Character"）与 public virtual int attack() const（返回 1）；public virtual ~Character() = default；
- Warrior : public Character：name() 返回 "Warrior"（这是隐藏，不是覆盖），attack() 返回 10；
- Mage : public Character：name() 返回 "Mage"，attack() 返回 7。
在 main 中：
1) 对 Warrior 对象 w，直接调用 w.name() 与 w.attack()；
2) 通过 Character* p = &w; 调用 p->name() 与 p->attack()；
3) 通过 Character& r = w; 调用 r.name() 与 r.attack()。
把三组输出写进注释并解释每一组为什么不同。

验证标准：你能明确说出「name() 三处输出的差异来自静态绑定 vs 名字隐藏」以及「attack() 通过指针/引用时输出 10」。

**提示**：p->name() 调用的是 Character::name（非虚，静态绑定），返回 "Character"；w.name() 调用的是 Warrior::name（派生类自己的同名函数）。attack 是虚函数，所以只要通过指针或引用调用，就一定走 Warrior 的实现。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Character {
public:
    virtual ~Character() = default;
    std::string name() const { return "Character"; }      // 非虚
    virtual int attack() const { return 1; }              // 虚
};

class Warrior : public Character {
public:
    std::string name() const { return "Warrior"; }        // 隐藏基类版本
    int attack() const override { return 10; }
};

class Mage : public Character {
public:
    std::string name() const { return "Mage"; }
    int attack() const override { return 7; }
};

int main() {
    Warrior w;
    std::cout << "direct:  " << w.name() << ' ' << w.attack() << '\n';        // Warrior 10

    Character* p = &w;
    std::cout << "pointer: " << p->name() << ' ' << p->attack() << '\n';      // Character 10

    Character& r = w;
    std::cout << "ref:     " << r.name() << ' ' << r.attack() << '\n';        // Character 10

    Mage m;
    Character* pm = &m;
    std::cout << "mage:    " << pm->name() << ' ' << pm->attack() << '\n';    // Character 7
}
```
关键点：name() 非虚，通过基类指针/引用调用时按静态类型解析，返回 "Character"；attack() 是虚函数，通过基类指针/引用触发动态绑定，运行期才决定调用 Warrior::attack。这就解释了「为什么接口方法必须 virtual」。

</details>

#### 第 2 题 · 多态团队伤害统计（新手调用方零改动）（难度 3/3）

在上题基础上实现：
- 一个 free 函数 int totalDamage(const std::vector<Character*>& team)：遍历并累加每个角色的 attack()；
- 新增第三个派生类 Rogue : public Character（attack 返回 4，name 返回 "Rogue"），**不修改 totalDamage 的任何代码**；
- 在 main 中构造 {Warrior, Mage, Rogue} 的组合，打印总伤害（应为 21）与每个角色的 name()（这里用 w.name() 直接调用即可，或者改为虚函数再看一次结果）。

验证标准：加入 Rogue 后 totalDamage 函数体一行未改，输出 21。

**提示**：totalDamage 只依赖 Character 的接口（attack），新增派生类属于「对扩展开放」，不需要改动调用方，这正是动态绑定的收益。如果想打印真实类型名，把 name() 也改成 virtual，再对比一次输出。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>

class Character {
public:
    virtual ~Character() = default;
    std::string name() const { return "Character"; }
    virtual int attack() const { return 1; }
};

class Warrior : public Character {
public:
    std::string name() const { return "Warrior"; }
    int attack() const override { return 10; }
};

class Mage : public Character {
public:
    std::string name() const { return "Mage"; }
    int attack() const override { return 7; }
};

// 之后新增 Rogue 时，这个函数完全不用改
int totalDamage(const std::vector<Character*>& team) {
    int sum = 0;
    for (const Character* c : team) sum += c->attack();
    return sum;
}

int main() {
    Warrior w;
    Mage m;

    class Rogue : public Character {
    public:
        std::string name() const { return "Rogue"; }
        int attack() const override { return 4; }
    } r;

    std::vector<Character*> team = {&w, &m, &r};
    std::cout << "total=" << totalDamage(team) << '\n';   // 10 + 7 + 4 = 21
    for (Character* c : team) std::cout << c->name() << ' ';
    std::cout << '\n';
}
```
关键点：totalDamage 只依赖基类接口，新增派生类时无需修改，这就是「对扩展开放、对修改关闭」在多态上的体现；注意 name() 非虚，所以循环里打印的仍是 "Character"，想要真实名字必须把它也声明为 virtual。

</details>

---

### 周四 · override、final 与构造/析构中的虚调用 —— 学习 / 1 小时

**今天学什么**

- override 是一个「让编译器替你检查」的关键字：签名不一致（少 const、参数类型不同、返回类型不兼容）时直接编译失败，而不是悄悄变成一个隐藏基类函数的新函数。
- 写虚函数覆盖时最容易出的错是漏掉 const 或写错参数，导致「以为覆盖了、其实没覆盖」，运行期表现却是调用基类版本；因此覆盖一律加 override。
- final 用在两个位置：类尾部的 final 禁止被继承，函数后的 final 禁止被继续覆盖；它既能表达设计意图，也能让编译器做去虚化优化。
- 在构造函数或析构函数中调用虚函数，不会绑定到派生类的版本：构造基类子对象时派生类部分还没建立，析构基类时派生类部分已经销毁，此时调用派生实现会访问不存在的状态。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.3 虚函数（override 与 final 部分）、15.7 构造函数与拷贝控制（15.7.1 虚析构函数、构造/析构函数中的虚函数）；cppreference: override specifier, final specifier

**动手**

- 故意把一个人的覆盖函数漏写 const，观察「没有加 override 时」与「加了 override 时」两种编译结果，记录报错。
- 写一个基类构造函数里调用虚函数 log()，观察输出的是基类版本，并在注释里解释原因。

**完成标准**

- [ ] 所有覆盖基类虚函数的成员函数都加了 override
- [ ] 能说出 final 的两种用法及其设计含义
- [ ] 能解释构造/析构中虚调用不分发的原因，并给出替代写法

**课后题（2 道）**

#### 第 1 题 · 让 override 抓出你的签名错误（难度 2/3）

实现：
- Base：public virtual std::string info() const 返回 "Base"；public virtual void run() 打印 "Base::run"。
- Good : public Base：用 override 正确覆盖 info()，返回 "Good"。
- Bad : public Base：写一个 `std::string info()`（**漏掉 const**）且**不加 override**，然后通过 Base* 调用 info() 观察实际输出；再给它补上 override，记录编译器报错。
- Sealed final : public Base：把 info() 标为 final，再写一个 class Sub : public Sealed 试图覆盖 info()（用注释保留报错）。

验证标准：
1) Bad 中未加 override 时程序能编译，且 Base* 调用输出 "Base"（说明它没有覆盖成功）；
2) 加 override 后编译失败，报错关键词被记录；
3) 对 final 函数的再覆盖同样编译失败。

**提示**：Bad::info() 与 Base::info() const 是两个不同的函数（一个带 const 一个不带），所以它只是隐藏了基类版本，虚函数表里 Base 的位置仍然指向 Base::info。这也解释了为什么 output 是 "Base"。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

class Base {
public:
    virtual ~Base() = default;
    virtual std::string info() const { return "Base"; }
    virtual void run() { std::cout << "Base::run\n"; }
};

class Good : public Base {
public:
    std::string info() const override { return "Good"; }   // 正确覆盖
};

class Bad : public Base {
public:
    // 漏掉 const，也没有 override：这不是覆盖，而是隐藏
    std::string info() { return "Bad"; }
    // 补上 override 后编译失败：
    // error C3668: "Bad::info": 包含重写说明符 "override" 的方法没有重写任何基类方法
};

class Sealed final : public Base {          // 类被 final：不能被继承
public:
    std::string info() const final { return "Sealed"; }   // 函数被 final：不能被覆盖
};

// class Sub : public Sealed { };            // error C3246: 无法从 "Sealed" 继承，因为它已被声明为 "final"

int main() {
    Good g;
    Bad b;
    Base* p1 = &g;
    Base* p2 = &b;
    std::cout << p1->info() << '\n';    // Good
    std::cout << p2->info() << '\n';    // Base —— 漏写 const 导致没有覆盖成功
    p2->run();
}
```
关键点：override 把「签名写错」从运行期谜题变成编译期错误；final 表达的是设计约束（这个类/函数到此为止），同时也给编译器优化空间（可以确定调用目标而不走虚表）。

</details>

#### 第 2 题 · 构造与析构中的虚函数不会分发（难度 3/3）

实现：
- Base：构造函数里调用 virtual void log() const，析构函数里也调用一次；virtual void log() const 打印 "Base::log"。
- Derived : public Base：覆盖 log() 打印 "Derived::log"；自己的构造函数与析构函数也调用 log()。
在 main 中创建一个 Derived 对象。

要求：
1) 先预测输出顺序再运行，把预测与实际写在注释里；
2) 解释为什么 Base 的构造/析构里调用 log() 时打印的是 "Base::log"；
3) 用 2~3 行注释说明实践中应该怎么做（提示：把初始化逻辑放到派生类构造函数里，或提供一个显式的 init() 在对象构造完成后调用）。

**提示**：构造 Base 子对象时，派生类部分尚未构造，此时对象的动态类型被认为是 Base，虚表也不是 Derived 的；析构时同理，派生类部分已经销毁，因此不可能安全地调用派生实现。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

class Base {
public:
    Base() {
        std::cout << "Base ctor -> ";
        log();                 // 不会分发到 Derived::log
    }
    virtual ~Base() {
        std::cout << "Base dtor -> ";
        log();
    }
    virtual void log() const { std::cout << "Base::log\n"; }
};

class Derived : public Base {
public:
    Derived() {
        std::cout << "Derived ctor -> ";
        log();                 // 此时对象的动态类型已是 Derived
    }
    ~Derived() override {
        std::cout << "Derived dtor -> ";
        log();
    }
    void log() const override { std::cout << "Derived::log\n"; }
};

int main() {
    Derived d;
    std::cout << "--- 对象存活期间 ---\n";
}
/* 实际输出：
Base ctor -> Base::log
Derived ctor -> Derived::log
--- 对象存活期间 ---
Derived dtor -> Derived::log
Base dtor -> Base::log
*/
```
关键点：构造/析构期间动态类型会被「降级」——构造 Base 子对象与析构 Base 子对象时，对象的有效类型就是 Base，所以虚调用只到 Base::log，这避免了访问尚未构造或已经销毁的派生类成员。需要「构造完成后才执行的多态逻辑」时，应提供显式的 init()/start() 接口在对象完全构造好之后调用。

</details>

---

### 周五 · 纯虚函数、抽象类、虚析构与 RTTI —— 学习 / 1.5 小时

**今天学什么**

- 纯虚函数（= 0）把基类变成抽象类：不能创建对象，只能作为接口被继承；含纯虚函数的类就是「只描述能力、不提供实现」的契约。
- 纯虚函数也可以有函数体（在类外定义），派生类仍必须覆盖它，但可以通过 Base::f() 显式调用那份默认实现——这是「提供默认行为但不强迫使用」的工具。
- 只要一个类可能被多态删除（delete 一个基类指针），它的析构函数就必须是 virtual：否则只调用基类析构，派生类的资源泄漏，行为未定义。
- RTTI 提供 typeid（查询类型信息）与 dynamic_cast（在运行期安全地向下转型）：dynamic_cast 到指针失败返回 nullptr，到引用失败抛 std::bad_cast，这是「必须先确认真实类型才能做的事」的标准做法。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.4 抽象基类、15.7.1 虚析构函数、第 19 章 19.2 运行时类型识别（19.2.1 dynamic_cast、19.2.2 typeid）；cppreference: abstract class, dynamic_cast, typeid

**动手**

- 写抽象基类 Shape（纯虚 area()、name()，虚析构并在其中打印），派生 Circle 与 Rect，用 Shape* 数组 delete 每个元素，确认两层的析构都被调用。
- 用 dynamic_cast<Circle*>(p) 判断 p 指向的是不是 Circle，成功则调用 Circle 独有的 radius()，失败则打印"不是圆"。

**完成标准**

- [ ] 能说出抽象类的判定条件，以及抽象类为什么不能实例化
- [ ] 能解释「可能被多态删除的基类必须有虚析构」的原因
- [ ] dynamic_cast 的指针版与引用版失败行为都能写对并处理

**课后题（2 道）**

#### 第 1 题 · 抽象接口 LogSink（难度 2/3）

实现日志接口：
- 抽象类 LogSink：public 的 virtual void write(const std::string& msg) = 0（纯虚）；protected 的 int count_ = 0；public 的 int count() const；public virtual ~LogSink() = default。
- ConsoleSink : public LogSink：write 打印 "[console] msg" 并 ++count_；
- MemorySink : public LogSink：内部 std::vector<std::string> lines_，write 追加并 ++count_，额外提供 const std::vector<std::string>& lines() const。
- free 函数 void logAll(LogSink& sink, const std::vector<std::string>& msgs)：逐条 write。
在 main 中：用 logAll 向两种 sink 各写 3 条消息并打印 count；再写一行 `LogSink s;` 用注释保留「不能实例化抽象类」的编译错误。

验证标准：两种 sink 的 count() 都是 3，MemorySink 能取回原始 3 行文本，且注释中保留了抽象类不可实例化的报错。

**提示**：count_ 放在基类并设为 protected，写入计数的逻辑可以放进派生的 write 里（++count_），或者用非虚的 public 包装函数调用纯虚 doWrite——两种都可以，选后者时基类只有一个纯虚入口。抽象类不能创建对象是因为 vtable 里有未绑定的项。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>

class LogSink {
public:
    virtual ~LogSink() = default;
    virtual void write(const std::string& msg) = 0;   // 纯虚：必须被覆盖
    int count() const { return count_; }

protected:
    int count_ = 0;
};

class ConsoleSink : public LogSink {
public:
    void write(const std::string& msg) override {
        std::cout << "[console] " << msg << '\n';
        ++count_;
    }
};

class MemorySink : public LogSink {
public:
    void write(const std::string& msg) override {
        lines_.push_back(msg);
        ++count_;
    }
    const std::vector<std::string>& lines() const { return lines_; }

private:
    std::vector<std::string> lines_;
};

void logAll(LogSink& sink, const std::vector<std::string>& msgs) {
    for (const auto& m : msgs) sink.write(m);
}

int main() {
    // LogSink s;   // error C2259: "LogSink": 无法实例化抽象类

    std::vector<std::string> msgs = {"start", "tick", "stop"};
    ConsoleSink cs;
    MemorySink ms;
    logAll(cs, msgs);
    logAll(ms, msgs);
    std::cout << "console count=" << cs.count() << " memory count=" << ms.count() << '\n';
    for (const auto& line : ms.lines()) std::cout << "  stored: " << line << '\n';
}
```
关键点：抽象基类只描述契约（write），调用方 logAll 只依赖契约，因此能同时服务控制台与内存两种实现；count_ 作为公共状态放在基类 protected 中，避免每个派生类各写一份计数。

</details>

#### 第 2 题 · 虚析构 + dynamic_cast 下转型（难度 3/3）

实现：
- 抽象类 Shape：纯虚 double area() const、纯虚 std::string name() const、virtual ~Shape() 打印 "~Shape"。
- Circle : public Shape：成员 double r_，构造时打印 "Circle ctor"，析构打印 "~Circle"，area 返回 3.141592653589793 * r_ * r_，name 返回 "Circle"，额外提供 double radius() const。
- Rect : public Shape：成员 double w_, h_，析构打印 "~Rect"，area 返回 w_*h_，name 返回 "Rect"。
在 main 中：
1) 用一个 Shape* 数组（大小为 3，元素为 new Circle(1)、new Rect(2,3)、new Circle(2)），遍历打印 name 与 area，最后逐个 delete；
2) 写函数 void describe(Shape& s)：用 dynamic_cast<Circle*>(&s) 判断是否为圆，是则额外打印半径，否则打印"不是圆"；
3) 再写一个用引用做 dynamic_cast 的版本并捕获 std::bad_cast（需要 #include <typeinfo>）。

验证标准：delete 时每个元素都先打印派生类析构再打印 "~Shape"（证明虚析构生效）；describe 对两个圆与非圆给出正确分支；异常分支被捕获并打印。

**提示**：Shape* 的 delete 会调用虚析构，所以派生类析构一定先执行。dynamic_cast<Circle*>(ptr) 在类型不匹配时返回 nullptr，而 dynamic_cast<Circle&>(ref) 失败会抛 std::bad_cast，因此引用版本必须放在 try 里。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <typeinfo>
#include <vector>

class Shape {
public:
    virtual ~Shape() { std::cout << "~Shape\n"; }
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) { std::cout << "Circle ctor\n"; }
    ~Circle() override { std::cout << "~Circle\n"; }
    double area() const override { return 3.141592653589793 * r_ * r_; }
    std::string name() const override { return "Circle"; }
    double radius() const { return r_; }

private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    ~Rect() override { std::cout << "~Rect\n"; }
    double area() const override { return w_ * h_; }
    std::string name() const override { return "Rect"; }

private:
    double w_, h_;
};

void describe(Shape& s) {
    std::cout << s.name() << " area=" << s.area();
    if (Circle* c = dynamic_cast<Circle*>(&s)) {
        std::cout << " radius=" << c->radius();          // 指针版：失败返回 nullptr
    } else {
        std::cout << " 不是圆";
    }
    std::cout << '\n';
}

void describeRef(Shape& s) {
    try {
        Circle& c = dynamic_cast<Circle&>(s);            // 引用版：失败抛 bad_cast
        std::cout << "  引用转换成功，半径 " << c.radius() << '\n';
    } catch (const std::bad_cast& e) {
        std::cout << "  引用转换失败: " << e.what() << '\n';
    }
}

int main() {
    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(1));
    shapes.push_back(new Rect(2, 3));
    shapes.push_back(new Circle(2));

    double total = 0;
    for (Shape* s : shapes) total += s->area();
    std::cout << "total area=" << total << '\n';

    for (Shape* s : shapes) {
        describe(*s);
        describeRef(*s);
    }

    for (Shape* s : shapes) delete s;    // 虚析构：派生类析构先执行
}
```
关键点：基类析构声明为 virtual，delete Shape* 才会先调用派生类析构再销毁基类部分，否则行为未定义且派生资源泄漏；dynamic_cast 是「先确认真实类型再使用派生接口」的安全手段，指针版用 nullptr 判断、引用版用 std::bad_cast 捕获，两种都要会写。

</details>

---

### 周六 · 项目日：多态图形系统 —— 项目 / 2 小时

**今天学什么**

- 把本周全部要素合成一个可扩展系统：抽象基类定义接口、派生类实现行为、unique_ptr 管理生命周期、虚析构保证清理正确。
- 把「按面积排序」「按类型筛选」「总面积统计」写成只依赖基类接口的自由函数，是「面向接口编程」的直接体现：新增图形不需要改这些函数。
- RTTI 适合处理「少数真正需要区分的场景」（例如按类型统计、序列化），但主流程仍应通过虚函数分发；RTTI 用得多，通常说明接口设计还没抽象到位。

**阅读**：《C++ Primer（第 5 版）》第 15 章 15.4 抽象基类、15.8 容器与继承（15.8.1 在容器中放置（智能）指针）、15.9 文本查询程序再探（综合示例）

**动手**

- 实现 Shape 抽象基类与 Circle/Rect/Triangle 三个派生类，全部用 std::unique_ptr<Shape> 放进 std::vector，并按面积升序打印。
- 写 void scaleAll(std::vector<std::unique_ptr<Shape>>& v, double factor)：按类型改变尺寸（圆改半径、矩形改宽高、三角形改底），用 dynamic_cast 或新增虚函数 scale() 两种方式各实现一次并比较。

**完成标准**

- [ ] 整个项目没有手工 delete，容器析构时能看到 ~Shape 的输出
- [ ] 能说明排序、统计、缩放三个函数为什么在新增图形类型后不需要修改
- [ ] 能说出 dynamic_cast 适合处理什么、不适合处理什么

**课后题（2 道）**

#### 第 1 题 · 多态图形系统（排序、统计、虚析构）（难度 3/3）

用 std::unique_ptr 实现图形系统：
- 抽象基类 Shape：纯虚 double area() const、纯虚 std::string name() const、virtual ~Shape() 打印 "~Shape: " + name()。
- Circle : public Shape（半径，area = πr²）、Rect : public Shape（宽高）、Triangle : public Shape（底、高，area = 0.5*b*h），三者 name() 分别返回 "Circle"、"Rect"、"Triangle"。
- free 函数 double totalArea(const std::vector<std::unique_ptr<Shape>>& v)；
- free 函数 void sortByArea(std::vector<std::unique_ptr<Shape>>& v)，按面积升序；
- free 函数 void report(const std::vector<std::unique_ptr<Shape>>& v)：逐行打印序号、name、area（保留两位小数）。
验收（全部满足）：
1) 用 Circle(1)、Rect(2,3)、Triangle(4,5) 组成容器，totalArea 为 π + 6 + 10 约 19.14；
2) sortByArea 后报告顺序为 Circle(3.14) → Rect(6.00) → Triangle(10.00)；
3) 程序退出时按容器元素顺序（或逆序，取决于容器析构方式）打印出三条 "~Shape: xxx"，证明虚析构生效；
4) 全程不出现手工 delete。

**提示**：排序用 std::stable_sort 配 lambda：[](const auto& a, const auto& b){ return a->area() < b->area(); }。unique_ptr 不可拷贝，所以比较函数必须用 const 引用。想按类型做特殊处理时用 dynamic_cast，但主要行为仍走虚函数。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

constexpr double kPi = 3.141592653589793;

class Shape {
public:
    virtual ~Shape() { std::cout << "~Shape: " << name() << '\n'; }
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return kPi * r_ * r_; }
    std::string name() const override { return "Circle"; }
    double radius() const { return r_; }

private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "Rect"; }

private:
    double w_, h_;
};

class Triangle : public Shape {
public:
    Triangle(double base, double height) : base_(base), h_(height) {}
    double area() const override { return 0.5 * base_ * h_; }
    std::string name() const override { return "Triangle"; }

private:
    double base_, h_;
};

double totalArea(const std::vector<std::unique_ptr<Shape>>& v) {
    double sum = 0;
    for (const auto& p : v) sum += p->area();
    return sum;
}

void sortByArea(std::vector<std::unique_ptr<Shape>>& v) {
    std::stable_sort(v.begin(), v.end(),
                     [](const std::unique_ptr<Shape>& a, const std::unique_ptr<Shape>& b) {
                         return a->area() < b->area();
                     });
}

void report(const std::vector<std::unique_ptr<Shape>>& v) {
    std::cout << std::fixed << std::setprecision(2);
    int i = 1;
    for (const auto& p : v) {
        std::cout << i++ << ". " << std::setw(9) << std::left << p->name()
                  << " area=" << p->area() << '\n';
    }
}

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(1.0));
    shapes.push_back(std::make_unique<Rect>(2.0, 3.0));
    shapes.push_back(std::make_unique<Triangle>(4.0, 5.0));

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "total before sort = " << totalArea(shapes) << '\n';
    sortByArea(shapes);
    report(shapes);
    std::cout << "--- main 结束，容器析构 ---\n";
}
```
关键点：unique_ptr<Shape> 在析构时通过虚析构正确释放派生对象，所以整个程序没有一处 delete；排序与统计函数只依赖 Shape 的虚接口，新增图形类型时这两个函数完全不用改，这正是「面向接口编程」的收益。

</details>

#### 第 2 题 · 给图形系统加缩放与类型统计（难度 3/3）

在上一题基础上扩展（可另写一个文件）：
1) 给 Shape 增加纯虚 void scale(double factor)（factor > 0，否则抛 std::invalid_argument），三个派生类分别按「半径/宽高/底高」缩放，factor 需要同时作用于面积相关的两个维度（面积随 factor² 变化）。
2) free 函数 void scaleAll(std::vector<std::unique_ptr<Shape>>& v, double factor)：对每个元素调用 scale。
3) free 函数 std::map<std::string,int> countByType(const std::vector<std::unique_ptr<Shape>>& v)：用 typeid(*p).name() 或虚 name() 统计每类图形的数量。
4) free 函数 void describeEach(const std::vector<std::unique_ptr<Shape>>& v)：用 dynamic_cast 找出所有 Circle 并打印其半径，其余打印 "非圆: name"。
验收：容器为 {Circle(1), Rect(2,3), Circle(2), Triangle(4,5)} 时：
- countByType 得到 Circle=2、Rect=1、Triangle=1；
- scaleAll(v, 2.0) 后总面积变为原来的 4 倍（打印缩放前后对比）；
- describeEach 在两行打印出半径 1 与 4（缩放后为 2 与 4），其余类型走非圆分支。

**提示**：把缩放写成虚函数后就不需要 dynamic_cast 判断类型，这是优先方案。typeid(*p).name() 的返回值是实现定义的（可能带修饰前缀），想输出干净的类型名应使用自己的 name() 虚函数；本项目的 countByType 用虚 name() 即可，注释里说明 typeid 的局限。

<details>
<summary>参考答案</summary>

```cpp
#include <iomanip>
#include <iostream>
#include <map>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

constexpr double kPi = 3.141592653589793;

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    virtual void scale(double factor) = 0;

protected:
    static void checkFactor(double factor) {
        if (!(factor > 0)) throw std::invalid_argument("scale 因子必须为正");
    }
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return kPi * r_ * r_; }
    std::string name() const override { return "Circle"; }
    void scale(double factor) override {
        checkFactor(factor);
        r_ *= factor;
    }
    double radius() const { return r_; }

private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "Rect"; }
    void scale(double factor) override {
        checkFactor(factor);
        w_ *= factor;
        h_ *= factor;
    }

private:
    double w_, h_;
};

class Triangle : public Shape {
public:
    Triangle(double base, double height) : base_(base), h_(height) {}
    double area() const override { return 0.5 * base_ * h_; }
    std::string name() const override { return "Triangle"; }
    void scale(double factor) override {
        checkFactor(factor);
        base_ *= factor;
        h_ *= factor;
    }

private:
    double base_, h_;
};

double totalArea(const std::vector<std::unique_ptr<Shape>>& v) {
    double sum = 0;
    for (const auto& p : v) sum += p->area();
    return sum;
}

void scaleAll(std::vector<std::unique_ptr<Shape>>& v, double factor) {
    for (auto& p : v) p->scale(factor);
}

std::map<std::string, int> countByType(const std::vector<std::unique_ptr<Shape>>& v) {
    std::map<std::string, int> stat;
    for (const auto& p : v) ++stat[p->name()];   // 虚函数取名字，比 typeid 更可控
    return stat;
}

void describeEach(const std::vector<std::unique_ptr<Shape>>& v) {
    for (const auto& p : v) {
        if (const Circle* c = dynamic_cast<const Circle*>(p.get())) {
            std::cout << "圆，半径 " << c->radius() << '\n';
        } else {
            std::cout << "非圆: " << p->name() << '\n';
        }
    }
}

int main() {
    std::vector<std::unique_ptr<Shape>> v;
    v.push_back(std::make_unique<Circle>(1.0));
    v.push_back(std::make_unique<Rect>(2.0, 3.0));
    v.push_back(std::make_unique<Circle>(2.0));
    v.push_back(std::make_unique<Triangle>(4.0, 5.0));

    for (const auto& kv : countByType(v)) std::cout << kv.first << '=' << kv.second << ' ';
    std::cout << '\n';

    std::cout << std::fixed << std::setprecision(2);
    const double before = totalArea(v);
    scaleAll(v, 2.0);
    const double after = totalArea(v);
    std::cout << "before=" << before << " after=" << after
              << " ratio=" << after / before << '\n';

    describeEach(v);

    try {
        scaleAll(v, -1.0);
    } catch (const std::invalid_argument& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
}
```
关键点：缩放做成虚函数后调用方无需判断类型，dynamic_cast 只保留给「确实要拿到派生独有接口」的场景（如读取圆半径）；缩放同时作用于两个维度，所以面积按 factor² 变化，ratio 应为 4.00，这也可以当作缩放正确性的自检指标。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回看本周代码，把「继承表达 is-a、组合表达 has-a」「虚函数实现动态绑定需要哪些条件」两条用自己的话重写一遍。

**阅读**：《C++ Primer（第 5 版）》第 15 章小结

**动手**

- 可选任务：给你自己项目里的某个类层次画出 UML 式草图（基类接口、派生类清单、哪些虚哪些非虚），并标出把哪个继承关系改成组合会更合适。

**完成标准**

- [ ] 预测输出与实际一致，或能解释差异原因
- [ ] 两条核心结论（is-a vs has-a、动态绑定条件）已用自己的话写下

**课后题（1 道）**

#### 第 1 题 · 轻量自测：这段代码输出什么（难度 2/3）

先在心里作答，再运行验证，并把结论写成注释：
```cpp
#include <iostream>
struct B {
    B() { f(); }
    virtual ~B() = default;
    virtual void f() const { std::cout << "B::f "; }
};
struct D : B {
    D() { f(); }
    void f() const override { std::cout << "D::f "; }
};
int main() { D d; B* p = &d; p->f(); std::cout << '\n'; }
```
问题：1) 输出是什么？2) 构造函数里那次 f() 为什么不是 D::f？3) p->f() 为什么是 D::f？

**提示**：记住两条规则：构造/析构期间虚调用不分发（只看当前正在构造/析构的那一层）；通过基类指针调用虚函数才是运行期决定。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

struct B {
    B() { f(); }                              // 此时动态类型是 B
    virtual ~B() = default;
    virtual void f() const { std::cout << "B::f "; }
};

struct D : B {
    D() { f(); }                              // 此时 D 子对象已就绪，动态类型是 D
    void f() const override { std::cout << "D::f "; }
};

int main() {
    D d;                // B() 里 f() -> B::f ；D() 里 f() -> D::f
    B* p = &d;
    p->f();             // 虚调用，动态类型 D -> D::f
    std::cout << '\n';  // 输出：B::f D::f D::f
}
```
答案：1) 输出 `B::f D::f D::f`；2) 执行 B 的构造函数时派生类部分还没构造，对象的有效动态类型被降级为 B，所以走 B::f；3) p 指向的真实对象是 D，f 是虚函数且通过基类指针调用，运行期查虚表命中 D::f。

</details>

---

## 第 4 周 · 资源管理与异常

**本周目标**：把「资源」和「错误」都变成对象能表达的东西：用 RAII 让释放与作用域绑定，用异常把错误从深处传到能处理的地方，用智能指针表达所有权，并在设计上优先选择组合而不是继承。

### 周一 · RAII 与栈展开 —— 学习 / 1.5 小时

**今天学什么**

- RAII 是把资源的获得放在构造函数、释放放在析构函数：只要对象在栈上，无论正常返回还是异常退出，析构函数都会被调用，因此「忘记释放」在语法上不可能发生。
- 栈展开（stack unwinding）是异常传播的实现机制：throw 之后，编译器逐层退出作用域并调用已构造对象的析构函数，直到找到匹配的 catch；这正是 RAII 在异常路径下依然有效的原因。
- 手写 new/delete 的代码在异常路径下几乎必然泄漏：如果 new 与 delete 之间抛异常，delete 语句永远不会执行；把资源交给对象持有，就等于把这条路径交给了编译器。
- 析构函数不应抛异常：如果栈展开过程中析构函数又抛出第二个异常，程序会直接 terminate；因此析构里的清理动作必须自己吞掉错误，或者提供显式的 close() 让调用者处理失败。

**阅读**：《C++ Primer（第 5 版）》第 12 章 12.1.1 动态内存与智能指针（RAII 思想）、第 18 章 18.1.1 异常对象与栈展开、13.1.3 析构函数与异常；cppreference: RAII, throw expression

**动手**

- 实现 FileGuard 类包装 std::ofstream：构造时打开文件，析构时关闭；用它在 main 里写三行文本，并在中间人为 throw 一个异常，验证文件内容已刷入且没有句柄泄漏。
- 写两个 RAII 类 A 与 B，在同一个作用域里构造，抛异常后检查析构顺序（应为 B 先于 A）。

**完成标准**

- [ ] 能用自己的话解释栈展开与析构函数调用之间的关系
- [ ] FileGuard 在抛异常后确实打印了 file closed，文件内容完整
- [ ] 能说出析构函数中抛异常为什么危险

**课后题（2 道）**

#### 第 1 题 · 用 FileGuard 演示异常路径下的正确释放（难度 1/3）

实现 FileGuard 类：
- explicit FileGuard(const std::string& path)：用 std::ofstream 打开文件，失败（!f_) 抛 std::runtime_error；
- void writeLine(const std::string& s)：写一行；
- ~FileGuard()：析构时若流仍打开则 close()，并打印 "file closed\n"；
- delete 拷贝构造与拷贝赋值（文件句柄不应被复制）。
在 main 中：
1) 在 try 块里创建 FileGuard，写两行，然后 throw std::runtime_error("模拟失败")；
2) 在 catch 中打印错误信息；
3) 程序结束后（或再次读文件）确认两行文本确实写入并已正确关闭。

验证标准：即使抛出异常，也能看到 "file closed" 输出，且文件内容为两行完整文本（没有丢失缓冲区内容）。

**提示**：关键点是 FileGuard 对象在 try 块的作用域内构造，异常抛出时栈展开会调用它的析构函数，close() 把缓冲区刷入磁盘。若把 ofstream 直接裸放在 main 里而不封装，析构同样会执行——但一旦换成 FILE*、socket、mutex 这类非 RAII 资源，泄漏就立刻出现。

<details>
<summary>参考答案</summary>

```cpp
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>

class FileGuard {
public:
    explicit FileGuard(const std::string& path) : f_(path) {
        if (!f_) throw std::runtime_error("无法打开文件: " + path);
    }
    ~FileGuard() {
        if (f_.is_open()) {
            f_.close();
            std::cout << "file closed\n";
        }
    }
    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;

    void writeLine(const std::string& s) { f_ << s << '\n'; }

private:
    std::ofstream f_;
};

int main() {
    const std::string path = "raii_demo.txt";
    try {
        FileGuard g(path);
        g.writeLine("第一行");
        g.writeLine("第二行");
        throw std::runtime_error("模拟写入后失败");
        // g.writeLine("这一行不会执行");
    } catch (const std::exception& e) {
        std::cout << "catch: " << e.what() << '\n';
    }

    std::ifstream in(path);
    std::string line;
    int n = 0;
    while (std::getline(in, line)) {
        ++n;
        std::cout << "read: " << line << '\n';
    }
    std::cout << "lines=" << n << '\n';
}
```
关键点：写文件的对象在 try 作用域内构造，异常触发栈展开时它的析构函数被调用，close() 顺带完成 flush，因此读回的内容完整；如果这里换成 FILE* 或裸指针，异常路径上 close/delete 就会被跳过。

</details>

#### 第 2 题 · 对比泄漏版与 RAII 版的资源计数（难度 2/3）

实现一个全局计数器 int g_live = 0;，并写两个版本：
1) 泄漏版：函数 void leaky() 里 new int(42)，在 delete 之前 throw；
2) RAII 版：class IntHolder { int* p_; public: explicit IntHolder(int v) : p_(new int(v)) { ++g_live; } ~IntHolder() { delete p_; --g_live; } IntHolder(const IntHolder&) = delete; IntHolder& operator=(const IntHolder&) = delete; int value() const { return *p_; } };，函数 void safe() 里创建 IntHolder 后 throw。
在 main 中分别调用两者（各自 try/catch），打印每次调用后 g_live 的值。

要求：用注释解释 leaky() 里那一个 int 为什么必然泄漏，以及 safe() 为什么不会；再用 2 行说明：如果必须使用裸资源，应该把它包进什么样的类里。

验证标准：leaky 之后 g_live 增加且不回落（泄漏），safe 之后 g_live 回到 0。

**提示**：leaky() 里 new 出来的对象没有名字，也没有析构函数会去管它，delete 语句在 throw 之后永远不会执行。safe() 里 IntHolder 是栈对象，栈展开一定会调用它的析构函数。对裸资源来说，唯一可靠的办法就是写一个像 IntHolder 这样的小 RAII 包装类（这正是 unique_ptr 在做的事）。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>

int g_live = 0;

void leaky() {
    int* raw = new int(42);
    ++g_live;
    throw std::runtime_error("leaky 中途失败");
    delete raw;               // 永远执行不到
}

class IntHolder {
public:
    explicit IntHolder(int v) : p_(new int(v)) { ++g_live; }
    ~IntHolder() {
        delete p_;
        --g_live;
    }
    IntHolder(const IntHolder&) = delete;
    IntHolder& operator=(const IntHolder&) = delete;
    int value() const { return *p_; }

private:
    int* p_;
};

void safe() {
    IntHolder h(42);
    std::cout << "  h.value()=" << h.value() << '\n';
    throw std::runtime_error("safe 中途失败");
}

int main() {
    try {
        leaky();
    } catch (const std::exception& e) {
        std::cout << "leaky catch: " << e.what() << " live=" << g_live << '\n';
    }

    try {
        safe();
    } catch (const std::exception& e) {
        std::cout << "safe  catch: " << e.what() << " live=" << g_live << '\n';
    }
}
```
关键点：new 出来的裸指针没有任何机制保证在异常路径上被 delete，所以 live 计数不会回落；IntHolder 把释放绑到析构函数上，栈展开强制执行它，因此 live 回到 0。标准库的 unique_ptr 就是同一个思路的通用版本，实际代码应直接用它而不是自己写包装。

</details>

---

### 周二 · try / catch / throw 与异常传播 —— 学习 / 1.5 小时

**今天学什么**

- 捕获一律用引用（const std::exception&）：按值捕获会触发对象切片并多一次拷贝，按指针捕获则要自己管内存，两者都是反模式。
- catch 子句按书写顺序匹配，所以必须从最具体到最一般（先 std::out_of_range 再 std::exception），否则派生类异常会被基类 catch 提前截走。
- throw 表达式会拷贝/移动异常对象到一块由运行时管理的内存中，因此即使抛出的是局部对象，栈展开后 catch 拿到的对象依然有效；catch (...) 可以兜住所有异常但拿不到信息。
- 异常沿着调用链向上传播时，中间的每一层都会做栈展开（析构局部对象）但不会执行 throw 之后的代码；只有真正 catch 它的那一层会继续正常执行。

**阅读**：《C++ Primer（第 5 版）》第 5 章 5.6 try 语句块和异常处理（5.6.1 throw 表达式、5.6.2 try 语句块、5.6.3 标准异常）、第 18 章 18.1 异常处理（18.1.1 抛出异常、18.1.2 捕获异常、18.1.3 函数 try 语句块与构造函数）；cppreference: try block, catch clause

**动手**

- 写三层调用链 a() → b() → c()，c 中 throw，a 中 catch，在 b、c 的局部对象析构里打印，验证栈展开经过了两层。
- 故意把 catch (const std::exception&) 写在 catch (const std::out_of_range&) 前面，观察具体异常被基类接住，然后调整顺序。

**完成标准**

- [ ] 能说出捕获异常为什么必须用引用，按值捕获会有什么问题
- [ ] 能解释 catch 顺序为什么必须从具体到一般
- [ ] 三个自定义异常都被正确抛出并分类捕获

**课后题（2 道）**

#### 第 1 题 · 三层调用链的异常传播与捕获顺序（难度 2/3）

实现：
- void level3(int mode)：mode==1 抛 std::out_of_range，mode==2 抛 std::runtime_error，mode==3 抛 std::logic_error，其他情况正常返回。
- void level2(int mode)：构造一个局部对象（析构时打印 "~level2 local"），调用 level3(mode)。
- void level1(int mode)：构造一个局部对象（析构时打印 "~level1 local"），调用 level2(mode) 后再打印 "level1 正常结束"。
- main：对 mode = 1、2、3 各调用一次，用 try/catch 捕获，要求 catch 顺序为：先 std::out_of_range，再 std::runtime_error，再 std::logic_error，最后 std::exception。

验证标准：
1) mode=1、2、3 分别被对应的 catch 命中（打印的内容能区分）；
2) 每次异常都能看到 "~level2 local" 与 "~level1 local" 的析构输出；
3) level1 的 "正常结束" 行只在 mode=0 时出现。

**提示**：把 catch 写成从派生到基类的顺序：std::out_of_range 与 std::runtime_error、std::logic_error 都是 std::exception 的孙子类。异常对象由运行时保存，因此传播到 main 时 catch 依然能拿到完整的 what() 信息。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <stdexcept>

struct Local {
    const char* tag;
    explicit Local(const char* t) : tag(t) {}
    ~Local() { std::cout << "~" << tag << " local\n"; }
};

void level3(int mode) {
    if (mode == 0) return;
    if (mode == 1) throw std::out_of_range("level3: 下标越界");
    if (mode == 2) throw std::runtime_error("level3: 运行期错误");
    throw std::logic_error("level3: 逻辑错误");
}

void level2(int mode) {
    Local l("level2");
    level3(mode);
    std::cout << "level2 正常结束\n";
}

void level1(int mode) {
    Local l("level1");
    level2(mode);
    std::cout << "level1 正常结束\n";
}

int main() {
    for (int mode = 0; mode <= 3; ++mode) {
        std::cout << "=== mode " << mode << " ===\n";
        try {
            level1(mode);
        } catch (const std::out_of_range& e) {
            std::cout << "catch out_of_range: " << e.what() << '\n';
        } catch (const std::runtime_error& e) {
            std::cout << "catch runtime_error: " << e.what() << '\n';
        } catch (const std::logic_error& e) {
            std::cout << "catch logic_error: " << e.what() << '\n';
        } catch (const std::exception& e) {
            std::cout << "catch exception: " << e.what() << '\n';
        }
    }
}
```
关键点：异常从 level3 抛出后，level2 与 level1 依次做栈展开（各自的局部对象析构被调用）但不继续执行后续语句，直到 main 的 catch 命中；catch 必须按「具体在前、一般在后」排列，否则 std::exception 会把所有派生异常提前接走，丢失分类处理能力。

</details>

#### 第 2 题 · 自定义异常类与按类型分类处理（难度 3/3）

实现三个自定义异常类，都继承自标准异常：
- class ParseError : public std::runtime_error（带 what 信息）；
- class RangeError : public std::out_of_range；
- class ConfigError : public std::logic_error（额外保存一个 std::string field，提供 field() 访问器）。
再实现 int parseValue(const std::string& token)（在当前 day 先用简化规则）：
- 空串抛 ParseError("空输入")；
- 含非数字字符抛 ParseError("非法字符");
- 值大于 1000 抛 RangeError("超出上限");
- 值为 0 抛 ConfigError("value", "不允许 0");
- 否则返回解析结果。
main 中依次传入 "", "12a", "5000", "0", "42"，分别捕获三种异常（catch 顺序从具体到一般）并打印 e.what()，ConfigError 额外打印 field()。

验证标准：五种输入各自给出预期的异常类型或返回值 42，且 ConfigError 的 field() 返回 "value"。

**提示**：自定义异常只需继承并转发构造参数：class ParseError : public std::runtime_error { public: explicit ParseError(const std::string& m) : std::runtime_error(m) {} };。ConfigError 在初始化列表里调用基类构造并保存 field。注意 catch 到 std::runtime_error 也能接住 ParseError，所以具体类型要写在前面。

<details>
<summary>参考答案</summary>

```cpp
#include <cctype>
#include <iostream>
#include <stdexcept>
#include <string>

class ParseError : public std::runtime_error {
public:
    explicit ParseError(const std::string& msg) : std::runtime_error(msg) {}
};

class RangeError : public std::out_of_range {
public:
    explicit RangeError(const std::string& msg) : std::out_of_range(msg) {}
};

class ConfigError : public std::logic_error {
public:
    ConfigError(const std::string& field, const std::string& msg)
        : std::logic_error("字段 " + field + ": " + msg), field_(field) {}
    const std::string& field() const { return field_; }

private:
    std::string field_;
};

int parseValue(const std::string& token) {
    if (token.empty()) throw ParseError("空输入");
    for (char c : token) {
        if (!std::isdigit(static_cast<unsigned char>(c))) throw ParseError("非法字符: " + token);
    }
    const int v = std::stoi(token);
    if (v > 1000) throw RangeError("超出上限: " + token);
    if (v == 0) throw ConfigError("value", "不允许 0");
    return v;
}

int main() {
    const std::string inputs[] = {"", "12a", "5000", "0", "42"};
    for (const std::string& s : inputs) {
        std::cout << "input=\"" << s << "\" -> ";
        try {
            std::cout << "value=" << parseValue(s) << '\n';
        } catch (const ParseError& e) {
            std::cout << "ParseError: " << e.what() << '\n';
        } catch (const RangeError& e) {
            std::cout << "RangeError: " << e.what() << '\n';
        } catch (const ConfigError& e) {
            std::cout << "ConfigError[" << e.field() << "]: " << e.what() << '\n';
        } catch (const std::exception& e) {
            std::cout << "其他异常: " << e.what() << '\n';
        }
    }
}
```
关键点：自定义异常继承标准异常族之后，既能被具体类型的 catch 精确处理，也能被 catch (const std::exception&) 统一兜底（对接第三方代码时很有用）；异常类里可以携带额外上下文（如出错字段名），比只有一句字符串更容易定位问题。

</details>

---

### 周三 · 异常安全、noexcept 与 copy-and-swap —— 学习 / 1 小时

**今天学什么**

- 异常安全分三档：基本保证（不泄漏、对象仍可用但状态可能改变）、强保证（要么成功要么完全回滚）、不抛保证（声明 noexcept 并真的不抛）；写库代码时至少要给基本保证。
- 成员函数的异常安全等级取决于最弱的那一步，所以「先完成所有可能失败的操作，再做不会失败的提交」是提供强保证的通用套路（copy-and-swap 就是它的实现）。
- noexcept 是承诺不是优化提示：如果标了 noexcept 的函数真的抛出异常，程序直接 terminate；反过来，标准容器在扩容时是否采用移动而非拷贝，取决于移动构造是否声明 noexcept。
- 异常适合「罕见且无法就地处理」的错误（资源失败、契约被破坏），不适合正常控制流（比如用异常表示循环结束），因为抛出/捕获有明显开销，也会让代码难以推理。

**阅读**：《C++ Primer（第 5 版）》第 18 章 18.1.4 noexcept 异常说明、18.2 异常安全（后续版次可能并入 18.1）、第 5 章 5.6.3 标准异常；cppreference: exceptions, noexcept specifier, copy-and-swap

**动手**

- 给 IntArray 类实现 copy-and-swap 版本的 operator=，并用注释标出「哪里可能抛异常」「哪里保证不抛」。
- 写一个 noexcept 的 swap 与一个可能抛异常的 reserve，在 push_back 里按「先 reserve 再修改」的顺序组织，保证 push_back 至少提供基本保证。

**完成标准**

- [ ] 能区分异常安全的三个等级并举出本日代码中的例子
- [ ] 能说出 noexcept 是承诺而非提示，以及违背承诺的后果
- [ ] grow 的失败路径已用测试证明对象状态没有变化

**课后题（2 道）**

#### 第 1 题 · 用 copy-and-swap 提供强异常安全（难度 2/3）

实现 IntArray（int* 成员 + size）：
- IntArray()、explicit IntArray(int n, int init = 0)（n<0 抛 std::invalid_argument）；
- 拷贝构造（深拷贝）；
- void swap(IntArray& other) noexcept；
- IntArray& operator=(IntArray other)（copy-and-swap，形参按值）；
- int& at(int)、int size() const、int sum() const；
- 一个会抛异常的辅助：void setAll(int v)（v<0 时抛 std::runtime_error），实现里先校验再统一赋值（保证不会写到一半失败）。
在 main 中：
1) a = b 后数据正确、a 的原内存已释放（可用 static 计数验证）；
2) 在 try 里调用 a.setAll(-1) 并捕获，确认 a 的数据**完全没有变化**（强保证）；
3) 注释中说明 operator= 的三步（拷贝形参 → swap → 形参析构）各自提供了什么保障。

**提示**：copy-and-swap 的全部可能失败的动作都发生在形参副本上：如果拷贝构造抛异常，函数体根本没开始执行，*this 保持原状；swap 只是交换指针与大小，声明 noexcept 之后不可能失败。因此要么完整成功，要么完全不变。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <stdexcept>
#include <utility>

class IntArray {
public:
    IntArray() = default;
    explicit IntArray(int n, int init = 0) : size_(n), data_(n ? new int[n] : nullptr) {
        if (n < 0) throw std::invalid_argument("n 不能为负");
        std::fill(data_, data_ + n, init);
    }
    IntArray(const IntArray& o) : size_(o.size_), data_(o.size_ ? new int[o.size_] : nullptr) {
        std::copy(o.data_, o.data_ + o.size_, data_);
    }
    IntArray(IntArray&& o) noexcept : size_(o.size_), data_(o.data_) {
        o.size_ = 0;
        o.data_ = nullptr;
    }

    IntArray& operator=(IntArray other) {   // 1) 拷贝可能在形参上失败
        swap(other);                        // 2) swap 不抛异常
        return *this;                       // 3) other 析构，释放旧资源
    }

    void swap(IntArray& other) noexcept {
        std::swap(size_, other.size_);
        std::swap(data_, other.data_);
    }

    ~IntArray() { delete[] data_; }

    int& at(int i) { return data_[i]; }
    int size() const { return size_; }
    int sum() const {
        int s = 0;
        for (int i = 0; i < size_; ++i) s += data_[i];
        return s;
    }
    void setAll(int v) {
        if (v < 0) throw std::runtime_error("只接受非负值");   // 校验在修改之前
        std::fill(data_, data_ + size_, v);
    }

private:
    int size_ = 0;
    int* data_ = nullptr;
};

int main() {
    IntArray a(3, 1);
    a.at(0) = 7;
    IntArray b(2, 5);
    a = b;
    std::cout << "a.size=" << a.size() << " a.sum=" << a.sum() << '\n';   // 2 10

    const int before = a.sum();
    try {
        a.setAll(-1);
    } catch (const std::exception& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
    std::cout << "unchanged: " << std::boolalpha << (a.sum() == before) << '\n';
}
```
关键点：copy-and-swap 把「可能失败的拷贝」和「不可能失败的交换」分开，失败时 *this 未被触碰，成功时旧资源由形参析构释放，于是自动得到强异常安全与自赋值安全；setAll 也遵循同一原则：把所有校验放在任何修改之前，异常时对象保持原状。

</details>

#### 第 2 题 · 规划异常安全等级与 noexcept（难度 3/3）

为下面四个操作各写一句注释，标明它应达到的异常安全等级（基本/强/不抛）以及理由，然后**在代码中实现并验证**：
1) IntArray::size() const
2) IntArray::swap(IntArray&) 
3) IntArray::setAll(int v)（非法值抛异常）
4) IntArray::grow(int newSize)（把数组扩容到 newSize，保留原数据，newSize < size() 抛 std::invalid_argument）
要求：grow 必须提供**强保证**（失败后对象与调用前完全相同），并写测试：先用一个会失效的参数调用它（捕获异常），验证数据与容量都没变；再用合法参数调用，验证数据保留且新容量生效。

另外给 size() 与 swap() 加上 noexcept，并在注释里说明「标了 noexcept 之后如果真的抛异常会发生什么」。

验证标准：grow 失败后 sum() 与原容量都不变；成功后原数据保留；被标 noexcept 的函数确实不会抛。

**提示**：grow 的强保证做法：先 new 一块新内存并拷贝旧数据（这一步可能抛），成功后再 delete 旧内存、更新指针与容量（这一步不抛）。如果先 delete 再 new，一旦 new 失败对象就被破坏，只能提供基本保证。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <stdexcept>
#include <utility>

class IntArray {
public:
    explicit IntArray(int n, int init = 0) : size_(n), cap_(n), data_(n ? new int[n] : nullptr) {
        if (n < 0) throw std::invalid_argument("n 不能为负");
        std::fill(data_, data_ + n, init);
    }

    // 1) 只读查询：不抛保证
    int size() const noexcept { return size_; }
    int capacity() const noexcept { return cap_; }

    // 2) 交换指针与整数：不抛保证（标准库扩容也依赖这一点）
    void swap(IntArray& other) noexcept {
        std::swap(size_, other.size_);
        std::swap(cap_, other.cap_);
        std::swap(data_, other.data_);
    }

    // 3) 校验先于修改：失败时抛异常，对象保持原状 -> 强保证
    void setAll(int v) {
        if (v < 0) throw std::runtime_error("只接受非负值");
        std::fill(data_, data_ + size_, v);
    }

    // 4) 先申请并拷贝（可能失败），后释放与提交（不会失败） -> 强保证
    void grow(int newSize) {
        if (newSize < size_) throw std::invalid_argument("不能缩小");
        if (newSize == cap_) return;
        int* fresh = new int[newSize];                       // 可能抛 bad_alloc
        std::copy(data_, data_ + size_, fresh);
        std::fill(fresh + size_, fresh + newSize, 0);
        delete[] data_;                                      // 以下都不会失败
        data_ = fresh;
        cap_ = newSize;
    }

    ~IntArray() { delete[] data_; }

    int& at(int i) { return data_[i]; }
    int sum() const {
        int s = 0;
        for (int i = 0; i < size_; ++i) s += data_[i];
        return s;
    }

private:
    int size_ = 0;
    int cap_ = 0;
    int* data_ = nullptr;
};

int main() {
    IntArray a(3, 2);
    const int sumBefore = a.sum();
    const int capBefore = a.capacity();

    try {
        a.grow(1);
    } catch (const std::exception& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
    std::cout << std::boolalpha
              << "grow 失败后未变化: sum=" << (a.sum() == sumBefore)
              << " cap=" << (a.capacity() == capBefore) << '\n';

    a.grow(5);
    std::cout << "grow 成功: size=" << a.size() << " cap=" << a.capacity()
              << " sum=" << a.sum() << '\n';
    static_assert(noexcept(std::declval<IntArray&>().swap(std::declval<IntArray&>())),
                  "swap 必须是 noexcept");
}
```
关键点：noexcept 是硬承诺——函数一旦被标记却真的抛出异常，程序会调用 std::terminate 直接结束，因此只能给「实现上不可能失败」的函数（读取、交换指针）加；grow 把可能失败的分配与拷贝放在前面、把不失败的释放与提交放在后面，从而实现失败即完全回滚的强保证。

</details>

---

### 周四 · unique_ptr：独占所有权 —— 学习 / 1.5 小时

**今天学什么**

- unique_ptr 是「独占所有权」的表达：同一时刻只有一个 unique_ptr 拥有该对象，因此它禁止拷贝、只允许移动——所有权转移在类型系统里就是一次 std::move。
- 优先用 std::make_unique<T>(args...) 而不是 unique_ptr<T>(new T(args...))：前者避免了「new 成功、unique_ptr 构造前抛异常」的极小泄漏窗口，也更短更清晰。
- unique_ptr 的析构默认执行 delete，因此它管理多态对象时基类必须有虚析构；自定义删除器（如 delete[]、fclose 包装）通过第二个模板参数传入，是 RAII 包装 C 资源的通用手段。
- 函数签名用 unique_ptr 表达所有权语义：按值接收 unique_ptr<T> 表示「我接管所有权」，返回 unique_ptr<T> 表示「我把所有权交出去」，而只借用时应该传 T& 或 T*，不要传 unique_ptr。

**阅读**：《C++ Primer（第 5 版）》第 12 章 12.1.1 shared_ptr 类（unique_ptr 操作部分）、12.1.5 unique_ptr、第 13 章 13.6 对象移动（与 unique_ptr 的配合）；cppreference: std::unique_ptr, std::make_unique

**动手**

- 用 unique_ptr<Shape> 改写上周的图形容器，观察 delete 与手工循环被彻底删除。
- 为 FILE* 写一个自定义删除器的 unique_ptr（deleter 调用 fclose），并用它读取一个文本文件。

**完成标准**

- [ ] 能解释 unique_ptr 为什么禁止拷贝、移动之后源指针的状态
- [ ] 能说出 make_unique 相对 new 的两个好处
- [ ] 会用自定义删除器包装非 new 分配的资源

**课后题（2 道）**

#### 第 1 题 · unique_ptr 的所有权转移与工厂函数（难度 2/3）

实现：
- 用 unique_ptr 承载一个多态对象：抽象类 Animal（纯虚 std::string speak() const、virtual ~Animal() 打印 "~Animal: name"），Dog 与 Cat 两个派生类（speak 返回 "Woof"/"Meow"）。
- 工厂函数 std::unique_ptr<Animal> createAnimal(const std::string& kind)："dog" 返回 make_unique<Dog>()，"cat" 返回 make_unique<Cat>()，其他情况抛 std::invalid_argument。
- 容器函数 void listen(const std::vector<std::unique_ptr<Animal>>& zoo)：打印每只动物的 speak()。
- 接管函数 void adopt(std::unique_ptr<Animal> pet)：按值接收，打印 "adopted: " + pet->speak()，函数结束时 pet 析构（观察输出）。
在 main 中：用工厂造三只动物放进 vector；调用 listen；用 auto pet = createAnimal("dog"); adopt(std::move(pet)); 验证移动后 pet 为空（打印 pet == nullptr）；最后注释保留 `adopt(pet);` 与 `auto copy = pet;` 的编译错误。

验证标准：adopt 结束后打印了 ~Animal；pet 变成 nullptr 且不重复析构；两处拷贝相关编译错误被记录。

**提示**：unique_ptr 的移动构造把指针转走并把源置空，所以 std::move(pet) 之后 pet == nullptr 为 true。按值接收 unique_ptr 的函数就是「所有权终点」，它在返回时销毁对象；想继续使用就必须 std::move 进去，普通传参会编译失败。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

class Animal {
public:
    virtual ~Animal() { std::cout << "~Animal: " << speak() << '\n'; }
    virtual std::string speak() const = 0;
};

class Dog : public Animal {
public:
    std::string speak() const override { return "Woof"; }
};

class Cat : public Animal {
public:
    std::string speak() const override { return "Meow"; }
};

std::unique_ptr<Animal> createAnimal(const std::string& kind) {
    if (kind == "dog") return std::make_unique<Dog>();
    if (kind == "cat") return std::make_unique<Cat>();
    throw std::invalid_argument("未知动物: " + kind);
}

void listen(const std::vector<std::unique_ptr<Animal>>& zoo) {
    for (const auto& a : zoo) std::cout << a->speak() << ' ';
    std::cout << '\n';
}

void adopt(std::unique_ptr<Animal> pet) {   // 按值：接管所有权
    std::cout << "adopted: " << pet->speak() << '\n';
}                                            // 函数结束，pet 析构

int main() {
    std::vector<std::unique_ptr<Animal>> zoo;
    zoo.push_back(createAnimal("dog"));
    zoo.push_back(createAnimal("cat"));
    zoo.push_back(createAnimal("dog"));
    listen(zoo);

    auto pet = createAnimal("dog");
    // adopt(pet);              // error C2664: 无法将 unique_ptr 左值转为右值（拷贝被删除）
    // auto copy = pet;         // error C2280: 尝试引用已删除的函数（拷贝构造）
    adopt(std::move(pet));
    std::cout << std::boolalpha << "pet 为空: " << (pet == nullptr) << '\n';
    std::cout << "--- main 结束，zoo 析构 ---\n";
}
```
关键点：unique_ptr 用「删除拷贝、保留移动」在类型层面表达独占所有权，std::move 之后源指针变为 nullptr，因此不会出现两个指针重复 delete；按值接收 unique_ptr 的参数即「所有权终点」，函数返回时自动销毁对象。

</details>

#### 第 2 题 · 用自定义删除器包装 C 风格资源（难度 3/3）

实现一个基于 FILE* 的读取器，要求全程不写手工 fclose：
- 定义删除器 struct FileCloser { void operator()(std::FILE* f) const noexcept { if (f) std::fclose(f); } };；
- using FilePtr = std::unique_ptr<std::FILE, FileCloser>;（需要 <cstdio>、<memory>）
- FilePtr openFile(const char* path)：fopen 成功则返回，失败抛 std::runtime_error；
- int countLines(std::FILE* f)：逐字符读到 EOF 统计 '\n' 个数（不含 fclose）。
在 main 中：
1) 先用 std::ofstream 写一个包含 3 行文本的临时文件；
2) 用 openFile 打开它，调用 countLines 打印 3；
3) 用 try/catch 处理打开不存在文件的异常；
4) 注释说明：如果没有自定义删除器，unique_ptr<FILE> 会调用 delete（类型不匹配，编译失败），所以删除器是必需的。

验证标准：打开成功的分支统计出 3 行，失败分支抛出并捕获 runtime_error，全程没有手工 fclose 调用。

**提示**：自定义删除器通过第二个模板参数传入，它只需满足「能用 FilePtr::pointer 调用」这个要求，可以是函数对象、函数指针或 lambda。删除器为空类时 unique_ptr 不增加额外存储（空基类优化）。

<details>
<summary>参考答案</summary>

```cpp
#include <cstdio>
#include <fstream>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

struct FileCloser {
    void operator()(std::FILE* f) const noexcept {
        if (f) std::fclose(f);
    }
};

using FilePtr = std::unique_ptr<std::FILE, FileCloser>;

FilePtr openFile(const char* path) {
    std::FILE* f = std::fopen(path, "r");
    if (!f) throw std::runtime_error(std::string("无法打开: ") + path);
    return FilePtr(f);          // 所有权交给 unique_ptr
}

int countLines(std::FILE* f) {
    int lines = 0;
    int c;
    while ((c = std::fgetc(f)) != EOF) {
        if (c == '\n') ++lines;
    }
    return lines;
}

int main() {
    const char* path = "lines.txt";
    {
        std::ofstream out(path);
        out << "alpha\nbeta\ngamma\n";
    }

    try {
        FilePtr fp = openFile(path);
        std::cout << "lines=" << countLines(fp.get()) << '\n';   // 3
    } catch (const std::exception& e) {
        std::cout << "catch: " << e.what() << '\n';
    }

    try {
        FilePtr missing = openFile("no_such_file.txt");
        std::cout << "unexpected\n";
    } catch (const std::exception& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
}
```
关键点：unique_ptr 的第二个模板参数决定析构时做什么，因此它能统一包装 fopen/fclose、malloc/free、socket/close 这类 C 资源，把它们也变成异常安全的 RAII 对象；默认删除器用的是 delete，对 FILE* 类型不匹配，必须自定义。

</details>

---

### 周五 · shared_ptr、weak_ptr 与组合优于继承 —— 学习 / 1.5 小时

**今天学什么**

- shared_ptr 用引用计数表达共享所有权：最后一个持有者销毁时对象才被释放；计数操作是原子但非免费，因此「默认用 unique_ptr，确需共享才 shared_ptr」是合理默认。
- 循环引用是 shared_ptr 的经典故障：A 持有 B 的 shared_ptr、B 也持有 A 的 shared_ptr，两者计数都永远不为 0，对象不会释放；把其中一条边改成 weak_ptr 即可打破循环。
- weak_ptr 是「观察但不拥有」：它不影响引用计数，使用前必须用 lock() 提升为 shared_ptr（对象已销毁则得到空指针），或用 expired() 检查，因此它天然适合缓存、观察者与父子反向指针。
- 组合优于继承：当关系是 has-a（一个对象「拥有」或「使用」另一个对象）时应把对方作为成员，这样实现可以随时替换、也不会被迫继承不需要的接口；继承只保留给真正的 is-a 与需要动态绑定的场合。

**阅读**：《C++ Primer（第 5 版）》第 12 章 12.1.1 shared_ptr 类、12.1.2 直接管理内存、12.1.4 智能指针和异常、12.1.5 unique_ptr、12.1.6 weak_ptr；cppreference: std::shared_ptr, std::weak_ptr, use_count

**动手**

- 写 Node 类（含 shared_ptr<Node> next_ 与 weak_ptr<Node> prev_）构造一个双向链条，打印 use_count 并验证销毁时对象被释放。
- 把「继承实现」改成「组合委托」：先写 class Logger : public Formatter 的错误版本，再改成 class Logger { Formatter fmt_; }，比较调用点写法与灵活性。

**完成标准**

- [ ] 能画出循环引用的计数变化并解释为什么永不释放
- [ ] 能说出 weak_ptr 的两种使用方式（lock / expired）及其适用场景
- [ ] 能举出一个「用继承实现、但应该改成组合」的例子

**课后题（2 道）**

#### 第 1 题 · 循环引用现场：从泄漏到 weak_ptr 修复（难度 3/3）

实现 Node 类，含 std::string name_ 与 std::shared_ptr<Node> next_；析构打印 "~Node(name)"。
1) 构造两个节点 a、b，让 a->next_ = b; b->next_ = a;（形成环），打印 use_count，并在 main 的末尾用一个作用域块验证两个对象都没有被析构（打印不到 ~Node）。
2) 把 next_ 改成 std::weak_ptr<Node>（或者增加 weak_ptr 的反向指针）重建同样的结构，验证作用域结束时两个对象正常析构。
3) 用注释写清：环上每个 shared_ptr 的计数分别是多少、为什么永远到不了 0。

验证标准：第 1 步确实看不到 ~Node 输出（泄漏），第 2 步能看到两行 ~Node；两次都打印了 use_count 佐证你的解释。

**提示**：环里 a 被 b->next_ 持有、b 被 a->next_ 持有，各自计数至少为 1，离开作用域时 a、b 这两个栈上的 shared_ptr 只把计数减到 1，所以谁都不释放。把逆向或正向连接改成 weak_ptr 后，那条边不增加计数，环就断了。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <memory>
#include <string>

// 用 weak_ptr 打破循环的版本
struct Node {
    std::string name;
    std::shared_ptr<Node> next;    // 正向：拥有
    std::weak_ptr<Node> prev;      // 反向：只观察，不增加计数

    explicit Node(std::string n) : name(std::move(n)) {}
    ~Node() { std::cout << "~Node(" << name << ")\n"; }
};

// 演示循环引用的版本
struct LeakyNode {
    std::string name;
    std::shared_ptr<LeakyNode> next;

    explicit LeakyNode(std::string n) : name(std::move(n)) {}
    ~LeakyNode() { std::cout << "~LeakyNode(" << name << ")\n"; }
};

int main() {
    std::cout << "--- 循环引用（泄漏）---\n";
    {
        auto a = std::make_shared<LeakyNode>("A");
        auto b = std::make_shared<LeakyNode>("B");
        a->next = b;
        b->next = a;
        std::cout << "a.use_count=" << a.use_count()
                  << " b.use_count=" << b.use_count() << '\n';
    }
    std::cout << "作用域已结束，上面若没有 ~LeakyNode 输出即为泄漏\n";

    std::cout << "--- weak_ptr 打破循环 ---\n";
    {
        auto a = std::make_shared<Node>("A");
        auto b = std::make_shared<Node>("B");
        a->next = b;
        b->prev = a;                 // 反向用 weak_ptr
        std::cout << "a.use_count=" << a.use_count()
                  << " b.use_count=" << b.use_count() << '\n';
        if (auto p = b->prev.lock()) std::cout << "b->prev 有效: " << p->name << '\n';
    }
    std::cout << "作用域已结束\n";
}
```
关键点：只用 shared_ptr 互相指向会形成环，环上每个对象都至少被一个 shared_ptr 持有，引用计数无法归零，析构函数永不调用；把反向边改成 weak_ptr 后它不参与计数，环被打破，对象按正常顺序释放。weak_ptr 用 lock() 提升为 shared_ptr 后再使用，可以避免访问已销毁对象。

</details>

#### 第 2 题 · 把继承改成组合（难度 3/3）

实现两种日志输出方案并比较：
1) 继承版：class Logger : public Formatter——把格式化逻辑放在基类 Formatter（virtual std::string format(const std::string&) const）里，Logger 直接用继承来的函数拼接前缀。
2) 组合版：class Logger { std::shared_ptr<Formatter> fmt_; std::string prefix_; }，构造函数注入 Formatter（允许运行时替换，提供 setFormatter()），log() 里调用 fmt_->format(prefix_ + msg)。
在 main 中：对两种版本各写一次输出，然后写 3~4 行注释回答：
- 组合版为什么可以在运行期替换格式化策略，而继承版只能在编译期决定？
- 组合版为什么不会强迫 Logger 继承 Formatter 的其余接口？

验证标准：两个版本输出格式一致（例如 "[INFO] 消息"），组合版能通过 setFormatter 换成另一种格式（例如 "INFO|消息"）并立即生效。

**提示**：组合版把「变化的部分」抽成另一个对象并以 shared_ptr 持有：Logger 只依赖 Formatter 的接口，因此在运行期可以指向不同实现。继承版的对象类型在编译期就固定了，想换格式只能换类型或加分支。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <memory>
#include <string>

// ---------- 1) 继承版 ----------
class Formatter {
public:
    virtual ~Formatter() = default;
    virtual std::string format(const std::string& msg) const { return msg; }
};

class Logger : public Formatter {
public:
    explicit Logger(std::string prefix) : prefix_(std::move(prefix)) {}
    void log(const std::string& msg) const {
        std::cout << format(prefix_ + msg) << '\n';   // 复用基类的 format
    }

private:
    std::string prefix_;
};

// ---------- 2) 组合版 ----------
class BracketFormatter : public Formatter {
public:
    std::string format(const std::string& msg) const override { return "[" + msg + "]"; }
};

class PipeFormatter : public Formatter {
public:
    std::string format(const std::string& msg) const override {
        auto pos = msg.find(' ');
        if (pos == std::string::npos) return msg;
        return msg.substr(0, pos) + "|" + msg.substr(pos + 1);
    }
};

class ComposedLogger {
public:
    ComposedLogger(std::shared_ptr<Formatter> fmt, std::string prefix)
        : fmt_(std::move(fmt)), prefix_(std::move(prefix)) {}

    void setFormatter(std::shared_ptr<Formatter> fmt) { fmt_ = std::move(fmt); }
    void log(const std::string& msg) const {
        std::cout << fmt_->format(prefix_ + " " + msg) << '\n';
    }

private:
    std::shared_ptr<Formatter> fmt_;
    std::string prefix_;
};

int main() {
    Logger inherited("[INFO]");
    inherited.log("继承版输出");

    ComposedLogger composed(std::make_shared<BracketFormatter>(), "INFO");
    composed.log("组合版输出");
    composed.setFormatter(std::make_shared<PipeFormatter>());
    composed.log("换格式后输出");   // 运行期替换策略
}
```
关键点：继承版把格式化能力永久绑定在 Logger 的类型上，想换格式必须改类型或加条件分支；组合版把 Formatter 作为成员持有，接口与实现分离，因此可以在运行期通过 setFormatter 替换，也不必让 Logger 暴露 Formatter 的全部接口——这就是「组合优于继承」的具体收益。

</details>

---

### 周六 · 项目日：RAII 资源管理器 —— 项目 / 2 小时

**今天学什么**

- 把本周四件工具合成一个可用的子系统：RAII 包装句柄、unique_ptr 管理容器、自定义异常报告失败、copy-and-swap 提供强异常安全。
- 资源管理的接口设计重点是「所有权清晰」：谁负责释放、谁只是借用，用类型（unique_ptr vs 引用/裸指针）表达出来，比写在注释里可靠。
- 异常安全不是额外工作量，而是组织代码顺序的产物：把可能失败的步骤前置、把不失败的提交后置，就自然得到强保证。

**阅读**：《C++ Primer（第 5 版）》第 12 章 12.1 动态内存与智能指针（整节复习）、13.3 交换操作、18.1 异常处理（复习）

**动手**

- 实现 ResourcePool：内部 std::vector<std::unique_ptr<Resource>>，提供 add(std::unique_ptr<Resource>)、size()、const Resource& at(int) const、bool removeById(int)。
- 让 add 在重名时抛自定义异常 DuplicateError（继承 std::runtime_error），并验证抛出后容器内容完全未变（强保证）。

**完成标准**

- [ ] 重复 id 抛出异常后池内容未变，越界访问也被正确捕获
- [ ] 程序结束时每个资源恰好析构一次（输出行数与加入数量一致）
- [ ] 能解释 ResourcePool 为什么不可拷贝、以及这带来什么设计约束

**课后题（1 道）**

#### 第 1 题 · ResourcePool：RAII + unique_ptr + 自定义异常 + 强保证（难度 3/3）

实现一个资源池子系统，全部要求在同一份代码里成立：
1) class Resource：int id_、std::string name_，构造打印 "+ Resource(id,name)"，析构打印 "- Resource(id,name)"；提供 id()、name()。
2) 自定义异常 class DuplicateError : public std::runtime_error，信息里包含冲突的 id。
3) class ResourcePool：内部 std::vector<std::unique_ptr<Resource>> items_；
   - void add(std::unique_ptr<Resource> r)：若已存在相同 id（用 std::find_if 查找）则抛 DuplicateError，且**不改变**容器内容；否则 move 入容器；
   - int size() const；
   - const Resource& at(int index) const：越界抛 std::out_of_range；
   - const Resource* findById(int id) const：找不到返回 nullptr；
   - bool removeById(int id)：用 erase-remove 风格删除并返回是否删掉；
   - ResourcePool& operator=(ResourcePool other)（copy-and-swap 版本）：要求编译通过（因此需要为 ResourcePool 提供可用的移动构造……注意 unique_ptr 不可拷贝，请说明为什么这里只能移动，并在注释中给出结论）。
4) 在 main 中：
   - 加入 3 个资源；
   - 尝试加入重复 id 的资源并捕获 DuplicateError，验证 size() 仍为 3；
   - 用 findById 查找存在的与不存在的 id；
   - removeById 删除一个并打印 size()；
   - 用 try/catch 触发一次 at(99) 越界；
   - 程序结束时观察所有 ~Resource 输出（容器析构自动释放）。

验证标准：重复 id 抛出后 size 不变；删除后 size 递减；越界被捕获；退出时每个存活资源恰好打印一次析构；注释中说明 ResourcePool 为什么天然不可拷贝（unique_ptr 成员），以及此时 copy-and-swap 的 operator= 会退化成什么形式。

**提示**：unique_ptr 成员会让类的拷贝构造被隐式删除，因此 ResourcePool 的 operator=(ResourcePool other) 只有移动语义能走通（形参必须用移动构造），这也是「资源池」这类容器的正常形态。erase-remove 用 items_.erase(std::remove_if(items_.begin(), items_.end(), 谓词), items_.end())。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

class Resource {
public:
    Resource(int id, std::string name) : id_(id), name_(std::move(name)) {
        std::cout << "+ Resource(" << id_ << "," << name_ << ")\n";
    }
    ~Resource() { std::cout << "- Resource(" << id_ << "," << name_ << ")\n"; }

    int id() const { return id_; }
    const std::string& name() const { return name_; }

private:
    int id_;
    std::string name_;
};

class DuplicateError : public std::runtime_error {
public:
    explicit DuplicateError(int id)
        : std::runtime_error("资源 id 重复: " + std::to_string(id)) {}
};

class ResourcePool {
public:
    ResourcePool() = default;
    ResourcePool(ResourcePool&&) noexcept = default;             // 只支持移动
    ResourcePool& operator=(ResourcePool&&) noexcept = default;

    void add(std::unique_ptr<Resource> r) {
        if (!r) throw std::invalid_argument("不能加入空指针");
        const int id = r->id();
        const bool dup = std::any_of(items_.begin(), items_.end(),
                                     [id](const std::unique_ptr<Resource>& p) { return p->id() == id; });
        if (dup) throw DuplicateError(id);      // 抛出前容器未被修改 -> 强保证
        items_.push_back(std::move(r));         // 成功后才提交
    }

    int size() const { return static_cast<int>(items_.size()); }

    const Resource& at(int index) const {
        if (index < 0 || index >= size()) throw std::out_of_range("index 越界");
        return *items_[index];
    }

    const Resource* findById(int id) const {
        for (const auto& p : items_)
            if (p->id() == id) return p.get();
        return nullptr;
    }

    bool removeById(int id) {
        auto it = std::remove_if(items_.begin(), items_.end(),
                                 [id](const std::unique_ptr<Resource>& p) { return p->id() == id; });
        if (it == items_.end()) return false;
        items_.erase(it, items_.end());
        return true;
    }

    void clear() noexcept { items_.clear(); }

private:
    std::vector<std::unique_ptr<Resource>> items_;
};

void dump(const ResourcePool& pool) {
    std::cout << "pool size=" << pool.size() << ": ";
    for (int i = 0; i < pool.size(); ++i) std::cout << pool.at(i).name() << ' ';
    std::cout << '\n';
}

int main() {
    ResourcePool pool;
    pool.add(std::make_unique<Resource>(1, "texture"));
    pool.add(std::make_unique<Resource>(2, "mesh"));
    pool.add(std::make_unique<Resource>(3, "shader"));
    dump(pool);

    try {
        pool.add(std::make_unique<Resource>(2, "mesh-copy"));
    } catch (const DuplicateError& e) {
        std::cout << "catch: " << e.what() << '\n';
    }
    std::cout << std::boolalpha << "重复加入后 size 仍为 3: " << (pool.size() == 3) << '\n';

    std::cout << "findById(1)=" << (pool.findById(1) ? pool.findById(1)->name() : "null") << '\n';
    std::cout << "findById(9)=" << (pool.findById(9) ? "found" : "null") << '\n';

    std::cout << "removeById(3)=" << pool.removeById(3) << ' ';
    dump(pool);

    try {
        std::cout << pool.at(99).name() << '\n';
    } catch (const std::out_of_range& e) {
        std::cout << "catch: " << e.what() << '\n';
    }

    std::cout << "--- main 结束，pool 析构 ---\n";
}
```
关键点：add 的所有校验都在修改容器之前完成，抛异常时池内容保持不变（强保证）；Resource 的释放完全由 unique_ptr 与容器析构负责，程序里没有任何 delete；由于成员是 unique_ptr，ResourcePool 的拷贝操作被隐式删除，因此它只能移动——这本身就是「独占资源池」应有的语义。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回看本周代码，把「RAII 为什么在异常路径下也有效」「unique_ptr/shared_ptr/weak_ptr 的选择顺序」两条用自己的话重写一遍。

**阅读**：《C++ Primer（第 5 版）》第 12 章与第 18 章小结

**动手**

- 可选任务：翻出你之前写过的任意一段带 new/delete 的旧代码，把它改成 unique_ptr 版本，并检查是否还有需要手工释放的资源。

**完成标准**

- [ ] 五道判断题与代码判断都已作答并核对
- [ ] 已用一句话总结本周的核心：资源交给对象、错误交给异常、所有权交给智能指针

**课后题（1 道）**

#### 第 1 题 · 轻量自测：五道判断题与一段代码判断（难度 2/3）

先写下答案，再运行验证，并把结论写成注释：
1) 析构函数里抛异常会发生什么？
2) catch 一个异常应该用值、指针还是引用？为什么？
3) 标了 noexcept 的函数内部抛出异常会怎样？
4) unique_ptr 与 shared_ptr 的默认选择应该是哪个？weak_ptr 解决什么问题？
5) 「class Stack : public std::vector<int>」这种设计属于 is-a 还是 has-a？应该怎么改？
再判断下面这段代码有没有资源问题：
```cpp
std::shared_ptr<A> a = std::make_shared<A>();
std::shared_ptr<A> b = std::make_shared<A>();
a->peer = b;
b->peer = a;
```

**提示**：第 5 题的关键是「Stack 是一个 vector」这个断言并不成立——栈的语义是受限接口，不是 vector 的子类型，应该改成员 `std::vector<int> data_;`（has-a）。最后一段代码形成环，需要把一条边改成 weak_ptr。

<details>
<summary>参考答案</summary>

```cpp
#include <cstdio>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <vector>

// 第 5 题的组合版本：用成员而不是继承
class Stack {
public:
    void push(int v) { data_.push_back(v); }
    int pop() {
        if (data_.empty()) throw std::out_of_range("栈为空");
        const int v = data_.back();
        data_.pop_back();
        return v;
    }
    bool empty() const { return data_.empty(); }

private:
    std::vector<int> data_;      // has-a，而不是 is-a
};

// 最后一段代码的修复版
struct A {
    std::weak_ptr<A> peer;       // 反向/对等引用用 weak_ptr 打破环
    ~A() { std::cout << "~A\n"; }
};

int main() {
    Stack s;
    s.push(1);
    s.push(2);
    std::cout << "pop=" << s.pop() << " empty=" << std::boolalpha << s.empty() << '\n';

    auto a = std::make_shared<A>();
    auto b = std::make_shared<A>();
    a->peer = b;
    b->peer = a;
    std::cout << "a.use_count=" << a.use_count() << '\n';   // 1，weak_ptr 不计数
}
```
答案：1) 若正处于栈展开会直接 terminate，否则也会让异常逃出析构函数，因此析构中不应抛（必须自己吞掉）；2) 用引用（通常 const std::exception&），按值会切片并多拷贝，按指针还需手工释放；3) 直接调用 std::terminate，因为 noexcept 是硬承诺；4) 默认 unique_ptr，确需共享才 shared_ptr，weak_ptr 用来观察而不拥有、并打破 shared_ptr 循环引用；5) 是误用 is-a，应改成成员组合（上面的 Stack 即答案）。最后一段代码构成循环引用，把 peer 改成 weak_ptr 后两个对象就能正常析构。

</details>

---

## 第 5 周 · STL 容器与迭代器

**本周目标**：掌握常用标准库容器的接口与复杂度直觉，能按访问模式选择容器，并说清迭代器类别与失效规则。

### 周一 · std::vector：容量、访问与增长 —— 学习 / 1.5 小时

**今天学什么**

- size() 是元素个数，capacity() 是不重新分配就能容纳的元素个数，只有扩容过二者才会不等；reserve(n) 只提高容量而不改变 size。
- push_back 的均摊复杂度是 O(1)：容量不足时按倍数重新分配并搬移全部元素，所以提前 reserve 能消除搬移开销。
- operator[] 不做边界检查，at() 越界抛 std::out_of_range；data() 给出连续内存首地址，方便与 C 风格接口互通。
- vector 保证元素连续存储，任何触发扩容的操作都会让所有指向元素的迭代器、指针和引用一次性全部失效。

**阅读**：《C++ Primer（第 5 版）》第 9 章 9.3 顺序容器操作、9.4 vector 对象是如何增长的；cppreference: std::vector、std::vector::reserve

**动手**

- 分别用「不预留」和「先 reserve(1000)」两种方式连续 push_back 1000 个 int，打印每次容量变化的时刻与总扩容次数。
- 用 at() 故意访问越界下标，用 try/catch 捕获 std::out_of_range 并打印 what()。

**完成标准**

- [ ] 能说清 size 与 capacity 的区别，并解释 reserve 与 resize 的不同
- [ ] 跑出扩容日志：不预留时容量翻倍若干次，reserve 版本扩容次数为 0
- [ ] remove_even 输出 1 3 5 7，并注意 capacity 没有被缩小
- [ ] 两道题都编译通过并看懂参考实现的关键行

**课后题（2 道）**

#### 第 1 题 · 观察 vector 的扩容节奏（难度 1/3）

写一个函数 `void run(const std::string& name, bool pre_reserve, int n)`，在内部向 `std::vector<int>` 连续 push_back n 个元素，每当容量发生变化时打印 `name: cap X -> Y at size Z`。main 中分别以 pre_reserve=false 与 true 调用 n=1000，最后打印两种方式的 size、capacity 与扩容次数。验收：不预留时能看到若干次容量翻倍，预留时扩容次数为 0。

**提示**：循环前记录一次 capacity，push_back 之后比较，不同就打印并更新记录值；reserve 必须放在循环之前。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>

void run(const std::string& name, bool pre_reserve, int n) {
    std::vector<int> v;
    if (pre_reserve) v.reserve(static_cast<std::size_t>(n));
    std::size_t cap = v.capacity();
    int grow = 0;
    for (int i = 0; i < n; ++i) {
        v.push_back(i);
        if (v.capacity() != cap) {
            std::cout << name << ": cap " << cap << " -> " << v.capacity()
                      << " at size " << v.size() << std::endl;
            cap = v.capacity();
            ++grow;
        }
    }
    std::cout << name << ": size=" << v.size() << " capacity=" << v.capacity()
              << " grow_times=" << grow << std::endl;
}

int main() {
    run("no-reserve", false, 1000);
    run("reserve", true, 1000);
}
```
push_back 只在 size 达到 capacity 时重新分配，典型实现按 2 倍增长，所以 1000 个元素只扩容约 10 次。reserve 一次拿到足够内存，扩容次数降为 0，代价是可能浪费容量。

</details>

#### 第 2 题 · 原地删除偶数（不用 erase 循环）（难度 2/3）

实现 `void remove_even(std::vector<int>& v)`：删除所有偶数，保持剩余元素的相对顺序，只允许一次线性遍历，禁止在循环里反复 erase。main 中用 {1,2,3,4,5,6,7,8} 验证，输出必须是 `1 3 5 7`。

**提示**：设读下标 r 与写下标 w：r 扫过全部元素，遇到要保留的写到 w 处并令 ++w；遍历结束后把 vector 收缩到 w。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <vector>

void remove_even(std::vector<int>& v) {
    std::size_t w = 0;
    for (std::size_t r = 0; r < v.size(); ++r) {
        if (v[r] % 2 != 0) {
            v[w] = v[r];
            ++w;
        }
    }
    v.resize(w);
}

int main() {
    std::vector<int> v{1, 2, 3, 4, 5, 6, 7, 8};
    remove_even(v);
    for (int x : v) std::cout << x << ' ';
    std::cout << std::endl;
    std::cout << "size=" << v.size() << " capacity=" << v.capacity() << std::endl;
}
```
双指针压缩把「删除」变成「覆盖 + 截断」，复杂度 O(n) 且不释放容量（capacity 不变）。若换成循环 erase，每次删除都要搬移后面元素，退化为 O(n^2)。

</details>

---

### 周二 · std::string 与 std::deque —— 学习 / 1.5 小时

**今天学什么**

- std::string 就是 basic_string<char>，本质是字符容器：size/capacity/reserve/append/push_back 一套接口与 vector 类似。
- substr(pos,len) 返回新串，find 找不到时返回 std::string::npos，二者配合能完成不依赖正则的文本切分。
- c_str()/data() 给出以 '\0' 结尾的 C 风格指针，仅在字符串未被修改时有效；短字符串优化让短串不分配堆内存。
- deque 采用分段连续存储，两端插入删除均摊 O(1)，中间插删仍是 O(n)，并且不提供 data()。

**阅读**：《C++ Primer（第 5 版）》第 9 章 9.5 额外的 string 操作、9.1 顺序容器概述；cppreference: std::basic_string、std::deque

**动手**

- 用 find 与 replace 把一句话里所有 "bug" 替换成 "feature"，并统计替换次数。
- 用 deque 做滑动窗口：读入 10 个整数，始终只保留最近 3 个（超出时 pop_front）。

**完成标准**

- [ ] 能解释 reserve 与 resize、c_str 的生命周期限制
- [ ] split_words 对连续空格不产生空串，输出长度正确
- [ ] max_window 输出 3 3 5 5 6 7 且能说明 O(n) 的原因
- [ ] 知道 deque 两端操作 O(1) 但不提供 data()

**课后题（2 道）**

#### 第 1 题 · 不用 stringstream 做单词切分（难度 1/3）

实现 `std::vector<std::string> split_words(const std::string& s)`，按一个或多个空格切分，返回不含空串的单词序列。main 用 getline 读入一行，逐行打印「单词 长度」。验收：输入 `hello   world  cpp` 输出三行，长度分别是 5、5、3。

**提示**：用两个下标：先把 i 跳过所有空格，再让 j 走到下一个空格；j > i 时用 substr(i, j - i) 取词，然后令 i = j。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>

std::vector<std::string> split_words(const std::string& s) {
    std::vector<std::string> out;
    std::size_t i = 0;
    while (i < s.size()) {
        while (i < s.size() && s[i] == ' ') ++i;
        std::size_t j = i;
        while (j < s.size() && s[j] != ' ') ++j;
        if (j > i) out.push_back(s.substr(i, j - i));
        i = j;
    }
    return out;
}

int main() {
    std::string line;
    std::getline(std::cin, line);
    for (const std::string& w : split_words(line))
        std::cout << w << " len=" << w.size() << std::endl;
}
```
substr 每次生成新串，因此这是一个会分配内存的 O(n) 算法；连续空格由「先跳空格再取词」自然处理，不会产生空串。

</details>

#### 第 2 题 · 用 deque 求滑动窗口最大值（难度 2/3）

实现 `std::vector<int> max_window(const std::vector<int>& v, std::size_t k)`，返回每个长度 k 的窗口中的最大值，要求总体复杂度 O(n)。验收：v = {1,3,-1,-3,5,3,6,7}，k = 3，输出 `3 3 5 5 6 7`。

**提示**：deque 里存下标而不是值，并让下标对应的值保持单调递减：新下标入队前先弹出队尾所有不大于它的值；队首下标滑出窗口时弹出队首。

<details>
<summary>参考答案</summary>

```cpp
#include <deque>
#include <iostream>
#include <vector>

std::vector<int> max_window(const std::vector<int>& v, std::size_t k) {
    std::deque<std::size_t> dq;
    std::vector<int> res;
    for (std::size_t i = 0; i < v.size(); ++i) {
        while (!dq.empty() && dq.front() + k <= i) dq.pop_front();
        while (!dq.empty() && v[dq.back()] <= v[i]) dq.pop_back();
        dq.push_back(i);
        if (i + 1 >= k) res.push_back(v[dq.front()]);
    }
    return res;
}

int main() {
    std::vector<int> v{1, 3, -1, -3, 5, 3, 6, 7};
    for (int x : max_window(v, 3)) std::cout << x << ' ';
    std::cout << std::endl;
}
```
每个下标最多进队一次、出队一次，所以循环总量是 O(n)。deque 在这里同时被当作队列（队首）和栈（队尾）使用，这正是它两端 O(1) 的价值。

</details>

---

### 周三 · std::list 与 forward_list：节点式容器的代价 —— 学习 / 1 小时

**今天学什么**

- list 是双向链表：插入删除只影响常数个节点，其他元素的迭代器、引用保持有效，与 vector 的失效规则正好相反。
- 通用算法要求迭代器至少是前向或随机访问类别，list 只有双向迭代器，所以不能用 std::sort，要用成员函数 sort()（稳定归并）。
- splice 能在 O(1) 时间把节点从一个 list 转移到另一个而不拷贝元素，merge 用于合并两个已按同一规则排好序的 list。
- 链表节点分散在堆上、缓存不友好，实测遍历通常远慢于 vector；只有「频繁中间插删 + 元素大且拷贝昂贵」才优先考虑 list。

**阅读**：《C++ Primer（第 5 版）》第 9 章 9.3.6 容器操作可能使迭代器失效、9.3.4 forward_list 的特殊操作；cppreference: std::list、std::list::splice

**动手**

- 把一万个随机数分别放进 vector 与 list，各在中间位置插入 1000 次，计时并解释为什么链表不一定赢。
- 用成员 sort() 排好一个 list，再用 splice 把后半段整体搬到另一个 list 并打印两者。

**完成标准**

- [ ] 能说出 list 与 vector 在迭代器失效规则上的差别
- [ ] 边遍历边删除的写法正确，剩余元素为 1 3 7 9
- [ ] merge/splice 后 a、b 均为空，c 有序输出 10 个元素
- [ ] 能解释为什么 list 上不能用 std::sort

**课后题（2 道）**

#### 第 1 题 · 用 erase 返回值安全地边遍历边删除（难度 1/3）

给定 `std::list<int> l{5,1,2,3,4,5,6,7,8,9,10,5}`：先用「erase 返回下一个有效迭代器」的写法删除所有偶数，再统计并删除所有等于 5 的元素（用成员函数 remove），最后打印删除的 5 的个数与剩余元素。预期剩余 `1 3 7 9`，删除 5 的个数为 3。

**提示**：erase(it) 返回被删元素的下一个位置，所以只有删除分支才接收返回值；remove 不返回个数，删除前先用 std::count 统计。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <list>

int main() {
    std::list<int> l{5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 5};

    for (auto it = l.begin(); it != l.end(); ) {
        if (*it % 2 == 0) it = l.erase(it);
        else ++it;
    }

    std::size_t fives = static_cast<std::size_t>(std::count(l.begin(), l.end(), 5));
    l.remove(5);

    std::cout << "removed fives=" << fives << ' ';
    for (int x : l) std::cout << x << ' ';
    std::cout << std::endl;
}
```
删除分支一定要用 it = l.erase(it)，被删节点的迭代器立刻失效；非删除分支才 ++it。list::remove 按值删除全部匹配节点，返回 void，所以个数要自己先数。

</details>

#### 第 2 题 · 用 merge 与 splice 做有序合并（难度 2/3）

有已升序的 `std::list<int> a{1,3,5,7}` 与 `std::list<int> b{2,4,6}`：用成员函数 merge 把 b 并入 a（要求 b 变为空），再用 splice 在 O(1) 内把 a 的全部节点接到 `std::list<int> c{-2,-1,0}` 尾部。最后打印 c 的全部元素（应为 `-2 -1 0 1 2 3 4 5 6 7`），并打印 a.empty() 与 b.empty()。

**提示**：merge 要求两个 list 已按同一比较规则有序，否则结果未定义；splice(pos, other) 直接搬移节点，不拷贝元素。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <list>

int main() {
    std::list<int> a{1, 3, 5, 7};
    std::list<int> b{2, 4, 6};
    a.merge(b);

    std::list<int> c{-2, -1, 0};
    c.splice(c.end(), a);

    for (int x : c) std::cout << x << ' ';
    std::cout << std::endl;
    std::cout << "a.empty=" << a.empty() << " b.empty=" << b.empty() << std::endl;
}
```
merge 与 splice 都只改指针、不移动元素，因此是 O(1)（merge 本身是 O(n) 的比较次数）。被搬空的 a、b 仍是合法对象，只是 size 为 0。

</details>

---

### 周四 · std::map 与 std::set：有序关联容器 —— 学习 / 1.5 小时

**今天学什么**

- map/set 基于平衡二叉搜索树，元素按键有序，查找、插入、删除都是 O(log n)；set 的键同时就是值。
- map 的 operator[] 在键不存在时会值初始化并插入一个新元素，at() 不存在时抛 std::out_of_range，find() 返回 end() 表示不存在：只读查询要用 find 或 at。
- insert/emplace 返回 pair<iterator, bool>，bool 表示是否真的插入了；emplace 直接在容器内构造，省掉临时对象。
- lower_bound/upper_bound 给出按键的区间迭代器，适合做范围统计；erase 支持按键、按迭代器、按迭代器区间三种形式。

**阅读**：《C++ Primer（第 5 版）》第 11 章 11.1 使用关联容器、11.3 关联容器操作；cppreference: std::map、std::map::emplace

**动手**

- 用 map<string,int> 统计一段文本的词频，并用 find 查询某个词是否出现过。
- 用 set<int> 做插入去重，再打印 [lower_bound(30), upper_bound(60)) 区间内的全部元素。

**完成标准**

- [ ] 能说出 operator[]、at、find 三者在键不存在时的不同行为
- [ ] 词频前三输出 a 3 / b 3 / c 2
- [ ] ScoreBook 的 add/update/remove/get 分支全部跑通，异常被捕获
- [ ] 理解 insert/emplace 返回 pair<iterator,bool> 的含义

**课后题（2 道）**

#### 第 1 题 · 只用关联容器输出词频前三（难度 1/3）

给定文本 `a b c a b a d e b c`，用 map 统计每个词出现次数，然后只借助关联容器（不允许使用 <algorithm> 的排序算法）按「次数降序、次数相同按字典序升序」输出前 3 项。预期输出三行：`a 3`、`b 3`、`c 2`。

**提示**：再建一个键为次数、比较器为 std::greater<int> 的 map，值用 set<string> 存同次数的词，这样外层降序、内层自动字典序。

<details>
<summary>参考答案</summary>

```cpp
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <string>

int main() {
    const std::string text = "a b c a b a d e b c";
    std::map<std::string, int> freq;
    std::istringstream in(text);
    std::string w;
    while (in >> w) ++freq[w];

    std::map<int, std::set<std::string>, std::greater<int>> by_count;
    for (const auto& kv : freq) by_count[kv.second].insert(kv.first);

    int shown = 0;
    for (const auto& kv : by_count) {
        for (const auto& name : kv.second) {
            std::cout << name << ' ' << kv.first << std::endl;
            if (++shown == 3) return 0;
        }
    }
}
```
两层关联容器一次性解决了「主序降序、次序字典序」的需求，不需要额外的排序算法。std::greater<int> 来自 <functional>，作为 map 的比较器让迭代顺序变为从大到小。

</details>

#### 第 2 题 · 用 map 实现成绩册（难度 2/3）

实现类 `ScoreBook`，内部用 `std::map<std::string,int>`：add(name,score) 返回 bool（已存在则返回 false 且不覆盖）、update 返回 bool（不存在返回 false）、remove 返回 bool、get(name) 用 at() 取值（不存在抛 std::out_of_range）、top() 返回分数最高者的 pair、size() 返回人数。main 中覆盖全部分支：重复 add、更新不存在的键、更新成功、删除、取最高分，并用 try/catch 捕获 get 不存在的异常。

**提示**：add 用 emplace(...).second 直接拿到是否插入成功；update 必须先 find，不能直接用 operator[]，否则会把不存在的键插进去。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <utility>

class ScoreBook {
public:
    bool add(const std::string& name, int score) {
        return scores_.emplace(name, score).second;
    }
    bool update(const std::string& name, int score) {
        auto it = scores_.find(name);
        if (it == scores_.end()) return false;
        it->second = score;
        return true;
    }
    bool remove(const std::string& name) { return scores_.erase(name) == 1; }
    int get(const std::string& name) const { return scores_.at(name); }
    std::size_t size() const { return scores_.size(); }
    std::pair<std::string, int> top() const {
        std::pair<std::string, int> best("", -1);
        for (const auto& kv : scores_)
            if (kv.second > best.second) best = kv;
        return best;
    }

private:
    std::map<std::string, int> scores_;
};

int main() {
    ScoreBook book;
    std::cout << "add amy twice: " << book.add("amy", 90) << ' ' << book.add("amy", 80) << std::endl;
    book.add("bob", 75);
    book.add("cy", 88);
    std::cout << "update missing: " << book.update("zed", 60) << std::endl;
    std::cout << "update bob: " << book.update("bob", 95) << std::endl;
    std::cout << "remove cy: " << book.remove("cy") << std::endl;
    auto t = book.top();
    std::cout << "top=" << t.first << ' ' << t.second << " size=" << book.size() << std::endl;
    try {
        std::cout << book.get("nobody") << std::endl;
    } catch (const std::out_of_range& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }
}
```
emplace(...).second 让「插入成功与否」一次拿到，避免先 find 再 insert 的两次查找。update 用 find 而不是 operator[]，是为了不把不存在的名字悄悄插进容器；at() 则是「必须存在」语义的显式表达。

</details>

---

### 周五 · unordered 容器、迭代器类别与失效规则 —— 学习 / 1.5 小时

**今天学什么**

- unordered_map/unordered_set 是哈希表实现：平均 O(1) 查找与插入、最坏 O(n)，元素无序；bucket_count/load_factor/rehash 反映内部状态。
- 自定义类型作键要同时提供哈希函数与相等比较，并且二者必须一致：相等的对象必须有相同的哈希值，否则容器行为错误。
- 迭代器分五类——输入、输出、前向、双向、随机访问；算法对迭代器类别有要求，所以需要随机访问的 std::sort 不能作用于 list。
- 失效规则：vector/string 扩容后所有迭代器、指针、引用全部失效，erase 之后的迭代器也失效；map/set/list 的插入不影响已有迭代器，只有删除才让被删元素的迭代器失效。

**阅读**：《C++ Primer（第 5 版）》第 11 章 11.4 无序容器、第 9 章 9.3.6 容器操作可能使迭代器失效；cppreference: std::unordered_map、Iterator library（迭代器类别）

**动手**

- 给自定义 struct Point{x,y} 写哈希函数与相等比较，用它作 unordered_map 的键统计重复点出现次数。
- 分别用 vector 和 map 写一次「边遍历边删除」，只使用 erase 返回的迭代器继续遍历。

**完成标准**

- [ ] 能说出五种迭代器类别，以及算法为什么挑类别
- [ ] Point 去重后 size 为 3，并能解释哈希与相等的关系
- [ ] 程序中不会解引用已失效的迭代器
- [ ] 能准确复述 vector 与 map 的迭代器失效规则

**课后题（2 道）**

#### 第 1 题 · 让自定义类型成为哈希键（难度 2/3）

定义 `struct Point { int x; int y; };`，为它提供相等比较与哈希函数，然后把它放进 `std::unordered_set<Point, PointHash>`：依次插入 (1,2)、(1,2)、(3,4)、(1,3)。验收：size() 为 3（重复的 (1,2) 被去重），并打印 bucket_count 与 load_factor，最后打印全部元素。

**提示**：相等写成 operator==；哈希可以对两个 int 分别取 std::hash<int> 再混合，例如用移位异或把两个哈希搅在一起。

<details>
<summary>参考答案</summary>

```cpp
#include <cstddef>
#include <functional>
#include <iostream>
#include <unordered_set>

struct Point {
    int x;
    int y;
};

bool operator==(const Point& a, const Point& b) {
    return a.x == b.x && a.y == b.y;
}

struct PointHash {
    std::size_t operator()(const Point& p) const noexcept {
        std::size_t h1 = std::hash<int>{}(p.x);
        std::size_t h2 = std::hash<int>{}(p.y);
        return h1 ^ (h2 + 0x9e3779b97f4a7c15ULL + (h1 << 6) + (h1 >> 2));
    }
};

int main() {
    std::unordered_set<Point, PointHash> pts;
    pts.insert(Point{1, 2});
    pts.insert(Point{1, 2});
    pts.insert(Point{3, 4});
    pts.insert(Point{1, 3});

    std::cout << "size=" << pts.size() << " buckets=" << pts.bucket_count()
              << " load_factor=" << pts.load_factor() << std::endl;
    for (const Point& p : pts) std::cout << '(' << p.x << ',' << p.y << ") ";
    std::cout << std::endl;
}
```
哈希函数只决定元素落到哪个桶，真正判等仍靠 operator==，所以两者必须语义一致。混合两个哈希值时使用异或加常数可以降低 (x,y) 与 (y,x) 撞桶的概率；noexcept 让容器在需要时能放心使用它。

</details>

#### 第 2 题 · 验证两种失效规则（难度 3/3）

写程序对比两类容器的失效行为：(1) 让 vector 先 reserve(2)，压入两个元素后记住 data() 返回的地址，再 push_back 第三个元素触发扩容，比较扩容前后地址是否相同，并打印结论；(2) 让 map 先用 emplace 插入两个元素，记住 find(1) 得到的迭代器，再插入第三个元素，然后通过旧迭代器修改值并打印，证明 map 的插入不会让已有迭代器失效。要求程序只使用仍然有效的迭代器（不要解引用已失效的迭代器）。

**提示**：vector 扩容的判据是「size 超过 capacity」，用 data() 地址变化就能证明内存被重新分配；map 是节点式存储，插入新节点不动旧节点。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <map>
#include <vector>

int main() {
    std::vector<int> v;
    v.reserve(2);
    v.push_back(1);
    v.push_back(2);
    const int* before = v.data();
    v.push_back(3);
    std::cout << "vector reallocated: " << (before != v.data())
              << " (true means the old iterator/pointer is dead)" << std::endl;

    std::map<int, int> m;
    m.emplace(1, 100);
    m.emplace(2, 200);
    auto it = m.find(1);
    m.emplace(3, 300);
    it->second = 111;
    std::cout << "map iterator still valid: " << it->first << "=" << it->second << std::endl;
}
```
vector 的元素在一整块连续内存里，容量不足时必须整块搬家，因此旧地址全部作废；map 的每个元素是独立节点，插入只挂一个新节点，已有迭代器依然指向原节点。实践中只要记住「vector 任何可能扩容的操作后不要留旧迭代器」就不会踩坑。

</details>

---

### 周六 · 复习与实验：容器怎么选 —— 复习 / 2 小时

**今天学什么**

- 容器选择从访问模式出发：随机访问与尾部追加选 vector，两端操作选 deque，按键查找选 map/unordered_map，频繁中间插删才考虑 list。
- 复杂度相同不等于性能相同：连续存储的缓存局部性常让 vector 在遍历上大幅领先 list，用计时实验代替直觉猜测。
- 容器适配器 stack/queue/priority_queue 是对底层容器的接口裁剪，不提供迭代器；priority_queue 默认是最大堆。
- 把函数参数写成 const 引用或迭代器区间、遍历统一用范围 for + const auto&，可以显著降低日后替换容器类型的成本。

**阅读**：《C++ Primer（第 5 版）》第 9 章 9.1 顺序容器概述（容器选择建议）、第 11 章 11.1 使用关联容器、第 16 章 16.1.1 函数模板；cppreference: Containers library、std::priority_queue

**动手**

- 综合实验：对同一批一万条数据，分别用 vector、list、set、unordered_set 完成插入与查找，打印耗时表格。
- 用 priority_queue 从词频统计结果里取出前 3 名，理解适配器没有迭代器的限制。

**完成标准**

- [ ] 能给出四种容器的选择理由，并说出各自的典型误用
- [ ] 性能实验跑通且结果可复现，能解释 vector 与 list 的差距
- [ ] LRU 的 get(2) 返回 false、get(3) 返回 true
- [ ] 能解释为什么 map 里可以长期保存 list 迭代器

**课后题（2 道）**

#### 第 1 题 · 容器性能对比实验（难度 2/3）

用固定随机种子生成 100000 个 0~999999 的随机整数（std::mt19937 保证可复现）：(1) 分别存入 vector 与 list，各自完整遍历两遍并计时；(2) 把同一批数据插入 set 与 unordered_set，再各做 100000 次 find（查询值也来自固定种子），计时并打印四组耗时。验收：程序可重复运行、结论稳定，并能用缓存局部性与复杂度解释结果。

**提示**：计时用 std::chrono::steady_clock，把「构造数据」的时间排除在外；遍历时把结果累加到一个 volatile 或打印出来，避免编译器把整个循环优化掉。

<details>
<summary>参考答案</summary>

```cpp
#include <chrono>
#include <iostream>
#include <list>
#include <random>
#include <set>
#include <unordered_set>
#include <vector>

double ms(std::chrono::steady_clock::time_point a, std::chrono::steady_clock::time_point b) {
    return std::chrono::duration<double, std::milli>(b - a).count();
}

int main() {
    const int n = 100000;
    std::mt19937 gen(2024);
    std::uniform_int_distribution<int> dist(0, 999999);
    std::vector<int> data;
    data.reserve(n);
    for (int i = 0; i < n; ++i) data.push_back(dist(gen));

    std::vector<int> v(data.begin(), data.end());
    std::list<int> l(data.begin(), data.end());
    long long sink = 0;

    auto t0 = std::chrono::steady_clock::now();
    for (int r = 0; r < 2; ++r)
        for (int x : v) sink += x;
    auto t1 = std::chrono::steady_clock::now();

    for (int r = 0; r < 2; ++r)
        for (int x : l) sink += x;
    auto t2 = std::chrono::steady_clock::now();

    std::set<int> s(data.begin(), data.end());
    auto t3 = std::chrono::steady_clock::now();
    std::unordered_set<int> us(data.begin(), data.end());
    auto t4 = std::chrono::steady_clock::now();

    std::mt19937 gen2(7);
    std::vector<int> probe;
    probe.reserve(n);
    for (int i = 0; i < n; ++i) probe.push_back(dist(gen2));

    for (int x : probe) sink += static_cast<long long>(s.count(x));
    auto t5 = std::chrono::steady_clock::now();
    for (int x : probe) sink += static_cast<long long>(us.count(x));
    auto t6 = std::chrono::steady_clock::now();

    std::cout << "vector traverse(2x): " << ms(t0, t1) << " ms" << std::endl;
    std::cout << "list   traverse(2x): " << ms(t1, t2) << " ms" << std::endl;
    std::cout << "set    build: " << ms(t2, t3) << " ms" << std::endl;
    std::cout << "uset   build: " << ms(t3, t4) << " ms" << std::endl;
    std::cout << "set    find x" << n << ": " << ms(t4, t5) << " ms" << std::endl;
    std::cout << "uset   find x" << n << ": " << ms(t5, t6) << " ms" << std::endl;
    std::cout << "sink=" << sink << std::endl;
}
```
list 遍历要逐个追指针、跨越缓存行，通常比 vector 慢数倍，即使两者都是 O(n)。set 每次操作是 O(log n) 且节点分散，unordered_set 平均 O(1) 但要算哈希，数据量大且哈希分布好时优势才明显；sink 累加是为了防止整个循环被优化掉。

</details>

#### 第 2 题 · 用 unordered_map + list 实现 O(1) 的 LRU 缓存（难度 3/3）

实现 `class LRUCache`：构造时给定容量；`bool get(int key, int& value)` 命中则把该键移到最近使用端并返回 true，未命中返回 false；`void put(int key, int value)` 插入或更新，超出容量时淘汰最久未使用的键。要求 get 与 put 都为 O(1)。main 中构造容量 2 的缓存，依次 put(1,1)、put(2,2)、get(1)、put(3,3)、get(2)（应为 false）、get(3)（应为 true），打印每步结果。

**提示**：unordered_map 存 key 到「list 迭代器」的映射，list 按使用顺序排列：表头是最近使用。命中时用 list::splice 把节点 O(1) 移到表头，淘汰时删表尾节点并同步从 map 里删掉它的键。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <list>
#include <unordered_map>
#include <utility>

class LRUCache {
public:
    explicit LRUCache(std::size_t cap) : cap_(cap) {}

    bool get(int key, int& value) {
        auto it = index_.find(key);
        if (it == index_.end()) return false;
        items_.splice(items_.begin(), items_, it->second);
        value = it->second->second;
        return true;
    }

    void put(int key, int value) {
        auto it = index_.find(key);
        if (it != index_.end()) {
            it->second->second = value;
            items_.splice(items_.begin(), items_, it->second);
            return;
        }
        if (items_.size() == cap_) {
            index_.erase(items_.back().first);
            items_.pop_back();
        }
        items_.emplace_front(key, value);
        index_[key] = items_.begin();
    }

private:
    std::size_t cap_;
    std::list<std::pair<int, int>> items_;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> index_;
};

int main() {
    LRUCache cache(2);
    int value = 0;
    cache.put(1, 1);
    cache.put(2, 2);
    std::cout << "get(1)=" << cache.get(1, value) << " value=" << value << std::endl;
    cache.put(3, 3);
    std::cout << "get(2)=" << cache.get(2, value) << std::endl;
    std::cout << "get(3)=" << cache.get(3, value) << " value=" << value << std::endl;
}
```
关键在于 list 的迭代器只在删除对应节点时失效，所以 map 里保存的迭代器可以长期使用；splice 只改指针不移动元素，因此命中提升到表头是 O(1)。这也是「list + 哈希表」这一组合的典型用法。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回顾本周主线：容器没有最好的，只有最合适的——先写清数据的访问模式（随机访问、两端操作、按键查找、中间插删），再决定用哪个容器。

**阅读**：《C++ Primer（第 5 版）》第 9 章 9.1 顺序容器概述（复习容器选择建议）；cppreference: Containers library

**动手**

- 可选任务：把自己以前写的代码里所有 C 风格数组改成 std::vector，记录需要改动的行数、遇到的最大障碍。

**完成标准**

- [ ] 回顾本周 6 天内容，能说出至少 3 条容器选择依据
- [ ] 三行遍历输出都正确
- [ ] 写下下周想重点补的 1 个容器知识点

**课后题（1 道）**

#### 第 1 题 · 三种容器的遍历接口是一致的（难度 1/3）

写一个程序，用 `std::vector<int>`、`std::deque<int>`、`std::list<int>` 各存 1 到 5，然后用同一段范围 for 分别打印三者，输出三行形如 `vector: 1 2 3 4 5`。验收：三种容器都能用完全相同的遍历语法打印，说明迭代器接口统一了它们。

**提示**：范围 for 只依赖 begin()/end()，与容器的内存布局无关；打印前缀不同，循环体可以直接复制三遍。

<details>
<summary>参考答案</summary>

```cpp
#include <deque>
#include <iostream>
#include <list>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3, 4, 5};
    std::deque<int> d{1, 2, 3, 4, 5};
    std::list<int> l{1, 2, 3, 4, 5};

    std::cout << "vector:";
    for (int x : v) std::cout << ' ' << x;
    std::cout << std::endl;

    std::cout << "deque:";
    for (int x : d) std::cout << ' ' << x;
    std::cout << std::endl;

    std::cout << "list:";
    for (int x : l) std::cout << ' ' << x;
    std::cout << std::endl;
}
```
三种容器的内存结构完全不同，但都提供 begin()/end() 返回迭代器，因此同一套遍历代码可以复用。这正是 STL 把「算法」与「容器」解耦的基础，也是下周算法能直接作用在容器区间上的原因。

</details>

---

## 第 6 周 · STL 算法与函数式写法

**本周目标**：把「手写 for 循环」替换为标准算法 + lambda，掌握排序、查找、改写、累积四类算法的用法与陷阱。

### 周一 · 只读算法：find/count/all_of 家族 —— 学习 / 1.5 小时

**今天学什么**

- 泛型算法只接收迭代器区间，完全不关心容器类型：find(first,last,value) 返回首个匹配位置的迭代器，找不到时返回 last。
- 带谓词的版本以 _if 结尾，接收可调用对象；count_if、find_if、any_of、all_of、none_of 都靠谓词描述条件。
- 只读算法不改变容器大小也不修改元素，for_each 是唯一允许携带副作用的只读型算法（如累加、打印）。
- 算法返回的是迭代器而不是下标，判断「找到没有」必须和 end() 比较，用 std::distance 才能换回下标。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.1 概述、10.2 初识泛型算法；cppreference: std::find_if、std::all_of、std::count_if

**动手**

- 给定一个城市名 vector，用 find 分别查询一个存在和一个不存在的名字，打印两种返回结果。
- 用 count_if 统计一组分数中及格与优秀的人数，用 all_of 判断所有分数是否都在合法区间。

**完成标准**

- [ ] 能说出 find 与 find_if 的返回值语义，以及为什么返回迭代器而不是下标
- [ ] 成绩报告四个统计量输出正确（pass=6、excellent=3、三个布尔为真）
- [ ] 能区分 all_of / any_of / none_of 的语义
- [ ] 至少把一道题的循环改写成算法调用

**课后题（2 道）**

#### 第 1 题 · 用 find_if 找到第一个长单词（难度 1/3）

给定 `std::vector<std::string>` 内容为 cpp、algorithm、stl、lambda、vector：用 `std::find_if` 找出第一个长度不小于 5 的单词，用 `std::distance` 算出它的下标并打印 `found: <单词> index=<下标>`；若不存在则打印 `not found index=-1`。预期输出 `found: algorithm index=1`。

**提示**：谓词写成接收 const std::string& 的 lambda，返回 s.size() >= 5；先用 it == words.end() 判断是否找到，再算 distance。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <iterator>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> words{"cpp", "algorithm", "stl", "lambda", "vector"};

    auto it = std::find_if(words.begin(), words.end(),
                           [](const std::string& s) { return s.size() >= 5; });

    if (it == words.end()) {
        std::cout << "not found index=-1" << std::endl;
    } else {
        std::ptrdiff_t idx = std::distance(words.begin(), it);
        std::cout << "found: " << *it << " index=" << idx << std::endl;
    }
}
```
find_if 返回迭代器，std::distance 用「当前迭代器减起始迭代器」换回下标，这两步是算法与下标世界之间的桥梁。若换成 find(words.begin(), words.end(), "stl")，就是按值查找而不是按条件查找。

</details>

#### 第 2 题 · 成绩体检报告（难度 2/3）

给定 `std::vector<int> scores{88,92,45,100,67,90,59,73}`：用 count_if 统计及格人数（>=60）与优秀人数（>=90）；用 all_of 判断是否所有分数都在 0~100；用 any_of 判断是否有满分；用 none_of 判断是否没有负分；最后用 for_each 把每个分数打印成 `88->B` 这种形式（>=90 为 A，>=60 为 B，其余 C）。验收：及格 6 人、优秀 3 人，三个布尔判断全部为真。

**提示**：每个方法各传一个 lambda 谓词；for_each 的 lambda 里用嵌套三目运算符决定等级，再打印分数与等级。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores{88, 92, 45, 100, 67, 90, 59, 73};

    int pass = static_cast<int>(std::count_if(scores.begin(), scores.end(),
        [](int s) { return s >= 60; }));
    int excellent = static_cast<int>(std::count_if(scores.begin(), scores.end(),
        [](int s) { return s >= 90; }));
    bool legal = std::all_of(scores.begin(), scores.end(),
        [](int s) { return s >= 0 && s <= 100; });
    bool has_full = std::any_of(scores.begin(), scores.end(),
        [](int s) { return s == 100; });
    bool no_negative = std::none_of(scores.begin(), scores.end(),
        [](int s) { return s < 0; });

    std::cout << "pass=" << pass << " excellent=" << excellent << std::endl;
    std::cout << "legal=" << legal << " has_full=" << has_full
              << " no_negative=" << no_negative << std::endl;

    std::for_each(scores.begin(), scores.end(), [](int s) {
        std::cout << s << "->" << (s >= 90 ? 'A' : (s >= 60 ? 'B' : 'C')) << ' ';
    });
    std::cout << std::endl;
}
```
count_if 返回的是 difference_type，转 int 打印更直观。any_of 与 none_of 是「存在」与「全都不」两种语义，避免手写标志位循环；for_each 的 lambda 通过返回值丢弃实现带副作用的遍历。

</details>

---

### 周二 · 排序与自定义比较器 —— 学习 / 1.5 小时

**今天学什么**

- std::sort 需要随机访问迭代器、平均 O(n log n)，但不稳定；std::stable_sort 会保持等值元素的原有相对顺序。
- 比较器必须构成严格弱序：comp(a,a) 必须为假，comp(a,b) 与 comp(b,a) 不能同时为真，写成 <= 是典型错误（会让 sort 越界或崩溃）。
- partial_sort 只保证前 k 个有序，nth_element 平均 O(n) 把第 k 小放到它该在的位置，二者都比完整排序更省。
- is_sorted / is_sorted_until 用同一个比较器验证结果，是排查「排序写完不对」的第一手段。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.2.3 重排容器元素的算法、10.3.1 向算法传递函数；cppreference: std::sort、std::nth_element、std::is_sorted

**动手**

- 对一组 (姓名, 分数) 记录按「分数降序、分数相同按姓名升序」排序并打印。
- 用 nth_element 求一组分数的中位数（不整体排序），再用 is_sorted 验证前面用 sort 的结果。

**完成标准**

- [ ] 能说出 sort 与 stable_sort 的差别及各自代价
- [ ] 两道题输出与预期完全一致，is_sorted 验证为 1
- [ ] 能解释为什么比较器不能写 >= 或 <=
- [ ] 知道 nth_element 与 partial_sort 各自适用的场景

**课后题（2 道）**

#### 第 1 题 · 两种降序写法（难度 1/3）

给定 `std::vector<int>{5,1,9,3,7}`：分别用 `std::greater<int>` 和自定义 lambda 各降序排序一份副本，打印两份结果，并用 `std::is_sorted` 配 lambda 验证第二份确实是降序。验收：两份都输出 `9 7 5 3 1`，验证结果为 1。

**提示**：is_sorted 要传与排序时相同的比较器，否则验证的语义不一致；lambda 写 return x > y;，不要写 >=。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a{5, 1, 9, 3, 7};
    std::sort(a.begin(), a.end(), std::greater<int>());
    for (int x : a) std::cout << x << ' ';
    std::cout << std::endl;

    std::vector<int> b{5, 1, 9, 3, 7};
    std::sort(b.begin(), b.end(), [](int x, int y) { return x > y; });
    for (int x : b) std::cout << x << ' ';
    std::cout << std::endl;

    bool desc = std::is_sorted(b.begin(), b.end(), [](int x, int y) { return x > y; });
    std::cout << "is_sorted(desc)=" << desc << std::endl;
}
```
std::greater<int> 是标准库提供的仿函数，作用与 lambda 完全相同但类型不同，二者都是「可调用对象」。比较器写成 x >= y 会破坏严格弱序：等值元素互不小于，排序内部会做出错误判断。

</details>

#### 第 2 题 · 多字段排序与中位数（难度 2/3）

定义 `struct Student { std::string name; int score; };`，数据为 amy:88、bob:95、cy:88、dan:72、eve:95。要求：(1) 排序规则是分数降序、分数相同时姓名升序，打印排序结果；(2) 把分数收集到新 vector，用 `std::nth_element` 求中位数（不整体排序）并打印。预期排序为 bob:95 eve:95 amy:88 cy:88 dan:72，中位数为 88。

**提示**：nth_element 的第二个参数是 begin() + n/2，它只保证该位置上的元素就是「第 n/2 小」，左右两侧内部无序；中位数下标取 size()/2。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
};

int main() {
    std::vector<Student> v{{"amy", 88}, {"bob", 95}, {"cy", 88}, {"dan", 72}, {"eve", 95}};

    std::sort(v.begin(), v.end(), [](const Student& a, const Student& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });
    for (const Student& s : v) std::cout << s.name << ':' << s.score << ' ';
    std::cout << std::endl;

    std::vector<int> scores;
    scores.reserve(v.size());
    for (const Student& s : v) scores.push_back(s.score);

    std::size_t mid = scores.size() / 2;
    std::nth_element(scores.begin(), scores.begin() + static_cast<std::ptrdiff_t>(mid), scores.end());
    std::cout << "median=" << scores[mid] << std::endl;
}
```
多字段比较必须写成「第一个字段不等时立即返回，否则比较第二个字段」，不能把两个条件用 && 混在一起。nth_element 只把第 mid 小放到正确位置，平均 O(n)，比完整排序更快。

</details>

---

### 周三 · 改写类算法与 erase-remove 惯用法 —— 练习 / 1.5 小时

**今天学什么**

- transform 把区间里的元素按规则映射到另一个（或同一个）区间，是把循环体改写成「一次映射」的核心算法。
- remove/remove_if 并不删除元素，只是把要保留的元素依次前移并返回新的逻辑结尾，容器 size 完全不变。
- 因此删除必须写成 v.erase(std::remove_if(v.begin(), v.end(), pred), v.end())：先搬移再截断，这就是 erase-remove 惯用法。
- copy_if 配合 std::back_inserter 可以把筛选结果追加到新容器，写起来比手工 push_back 更简洁也更容易读。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.2.2 写容器元素的算法、10.2.3 重排容器元素的算法、10.4.1 插入迭代器；cppreference: std::remove_if、std::back_inserter、std::partition

**动手**

- 用 erase-remove_if 原地删除 vector 中的全部偶数，打印删除前后的 size 与 capacity。
- 用 transform 把一组字符串统一转成大写，再用 copy_if + back_inserter 挑出长度大于 3 的字符串。

**完成标准**

- [ ] 能说出 remove_if 不删除元素、只搬移元素的原因
- [ ] erase-remove 版本 size 变 5、capacity 不变；只 remove 版本 size 保持 6
- [ ] 能解释 stable_partition 与 partition 的区别
- [ ] 会用 back_inserter 配合写入型算法

**课后题（2 道）**

#### 第 1 题 · erase-remove 与只 remove 不 erase 的差别（难度 2/3）

给定 `std::vector<int>{1,2,3,4,5,6,7,8,9,10}`：用 erase-remove_if 删除所有偶数，打印删除前后的 size 与 capacity 以及剩余元素。再取 `std::vector<int>{1,2,3,4,5,6}` 只调用 remove_if 而不 erase，打印它的 size、逻辑结尾下标，以及「逻辑结尾到 end()」之间残留的元素。验收：第一组 size 从 10 变 5、capacity 不变；第二组 size 仍是 6，但逻辑长度为 3。

**提示**：remove_if 返回新的逻辑结尾迭代器，用 std::distance(begin, newEnd) 得到逻辑长度；残留区间的元素是被覆盖后的旧值，不应再当成有效数据。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <iterator>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::cout << "before size=" << v.size() << " capacity=" << v.capacity() << std::endl;

    v.erase(std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());
    std::cout << "after  size=" << v.size() << " capacity=" << v.capacity() << " : ";
    for (int x : v) std::cout << x << ' ';
    std::cout << std::endl;

    std::vector<int> bad{1, 2, 3, 4, 5, 6};
    auto new_end = std::remove_if(bad.begin(), bad.end(), [](int x) { return x % 2 == 0; });
    std::cout << "bad size=" << bad.size()
              << " logical=" << std::distance(bad.begin(), new_end) << std::endl;
    std::cout << "residual: ";
    for (auto it = new_end; it != bad.end(); ++it) std::cout << *it << ' ';
    std::cout << std::endl;
}
```
remove_if 是通过「覆盖 + 返回新结尾」实现的，容器大小由 erase 决定，所以两步缺一不可。erase 只改 size 不动 capacity，这与第 5 周 remove_even 的双指针写法效果相同，但语义更清晰。

</details>

#### 第 2 题 · transform + stable_partition + copy_if 组合（难度 3/3）

给定 `std::vector<std::string>{"cpp","algorithm","stl","lambda","vector","set"}`：(1) 用 transform 原地把每个字符串变成大写；(2) 用 stable_partition 把长度大于 3 的字符串移到前面，打印分界点下标与整个序列；(3) 用 copy_if 配 back_inserter 把长度大于 3 的字符串复制到新 vector 并打印。预期分界点下标为 3，前面是 ALGORITHM、LAMBDA、VECTOR，后面是 CPP、STL、SET。

**提示**：transform 的 lambda 参数按值收一个 string，改完再返回，这样原地写回更安全；stable_partition 保持了两组内部的原有相对顺序。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <cctype>
#include <iostream>
#include <iterator>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> v{"cpp", "algorithm", "stl", "lambda", "vector", "set"};

    std::transform(v.begin(), v.end(), v.begin(), [](std::string s) {
        for (char& c : s)
            c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
        return s;
    });

    auto bound = std::stable_partition(v.begin(), v.end(),
        [](const std::string& s) { return s.size() > 3; });
    std::cout << "boundary=" << std::distance(v.begin(), bound) << " : ";
    for (const std::string& s : v) std::cout << s << ' ';
    std::cout << std::endl;

    std::vector<std::string> big;
    std::copy_if(v.begin(), v.end(), std::back_inserter(big),
        [](const std::string& s) { return s.size() > 3; });
    std::cout << "big: ";
    for (const std::string& s : big) std::cout << s << ' ';
    std::cout << std::endl;
}
```
stable_partition 返回的迭代器就是分区边界，std::distance 直接给出前半部分的元素个数。back_inserter 生成一个插入迭代器，让 copy_if 这类「写入型算法」能安全地增长目标容器，不必事先知道结果个数。

</details>

---

### 周四 · lambda 表达式与捕获列表 —— 学习 / 1.5 小时

**今天学什么**

- lambda 的完整形式是 [捕获列表](参数列表){ 函数体 }，编译器为每个 lambda 生成一个唯一的闭包类型，因此它比函数指针更「重」也更灵活。
- 值捕获在 lambda 创建时拷贝一份外部变量，默认不可修改（要修改副本需加 mutable）；引用捕获直接引用外部变量，悬垂引用是它最大的坑。
- 初始化捕获 [p = std::move(ptr)] 能捕获只能移动的对象；[this] 捕获当前对象指针，使 lambda 能访问成员变量。
- 泛型 lambda 用 auto 作为参数类型（本质是模板化的 operator()），当各分支返回类型不一致时可用 ->T 显式指定返回类型。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.3.2 lambda 表达式、10.3.3 lambda 捕获和返回；cppreference: Lambda expressions、std::for_each

**动手**

- 用 lambda 作为比较器让 sort 按「字符串长度降序、长度相同按字典序升序」排序。
- 分别用值捕获和引用捕获在 for_each 中统计满足条件的元素个数，观察外部变量的变化。

**完成标准**

- [ ] 能说出值捕获、引用捕获、初始化捕获各自的语义与风险
- [ ] 两道题输出与预期一致，并能解释值捕获为什么改不动外部变量
- [ ] 能说明无捕获 lambda 与函数指针的转换关系
- [ ] 至少写过一个 mutable lambda 并知道它的作用范围

**课后题（2 道）**

#### 第 1 题 · 值捕获与引用捕获的差别（难度 1/3）

给定 `std::vector<int>{4,7,10,13,16,21}` 与阈值 limit=10：第一次用 `[by_value, limit] mutable` 值捕获计数大于阈值的元素个数并打印；第二次用 `[&by_ref, limit]` 引用捕获做同样统计并打印。验收：值捕获版本外部变量仍为 0，引用捕获版本为 3，并解释原因。

**提示**：值捕获的变量是闭包对象里的副本，mutable 只允许修改这个副本；for_each 返回后闭包对象就被销毁了，所以外部看不到变化。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v{4, 7, 10, 13, 16, 21};
    const int limit = 10;

    int by_value = 0;
    std::for_each(v.begin(), v.end(), [by_value, limit](int x) mutable {
        if (x > limit) ++by_value;
    });
    std::cout << "value capture count=" << by_value << std::endl;

    int by_ref = 0;
    std::for_each(v.begin(), v.end(), [&by_ref, limit](int x) {
        if (x > limit) ++by_ref;
    });
    std::cout << "reference capture count=" << by_ref << std::endl;
}
```
值捕获得到的是创建时刻的拷贝，mutable 只放开对闭包内部副本的修改权限，因此外部 by_value 保持 0。引用捕获没有拷贝，闭包直接操作外部变量，所以统计结果 3 能带回外部；代价是必须保证被引用对象比 lambda 活得久。

</details>

#### 第 2 题 · 把可调用对象当参数传递（难度 2/3）

实现 `std::vector<int> apply_all(const std::vector<int>& v, int (*f)(int))`，返回对每个元素调用 f 后的新向量。用无捕获 lambda（平方、加 10）各测试一次，并说明有捕获的 lambda 为什么不能传进去。要求两个测试的输出分别是 `1 4 9 16` 与 `11 12 13 14`。

**提示**：无捕获 lambda 可以隐式转换成函数指针；一旦捕获了外部变量，闭包就携带状态，函数指针装不下这个状态，所以转换失败。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <vector>

std::vector<int> apply_all(const std::vector<int>& v, int (*f)(int)) {
    std::vector<int> out;
    out.reserve(v.size());
    for (int x : v) out.push_back(f(x));
    return out;
}

int main() {
    std::vector<int> v{1, 2, 3, 4};

    for (int x : apply_all(v, [](int x) { return x * x; })) std::cout << x << ' ';
    std::cout << std::endl;

    for (int x : apply_all(v, [](int x) { return x + 10; })) std::cout << x << ' ';
    std::cout << std::endl;
}
```
参数类型写成 int (*)(int) 时，只有无捕获 lambda 能隐式转换过来，这也是它和普通函数指针的兼容点。想接收带状态的闭包，就要用模板参数或 std::function，这是明天要学的两种方案。

</details>

---

### 周五 · 函数对象、std::function 与累积算法 —— 学习 / 1.5 小时

**今天学什么**

- 函数对象是重载了 operator() 的类：它能携带状态、能被编译器内联，所以做算法谓词通常优于函数指针。
- std::function 是通用的可调用对象包装器，能统一保存函数指针、lambda、仿函数，代价是类型擦除带来的间接调用与可能的堆分配。
- std::accumulate(first,last,init,op) 用二元操作把区间折叠成一个值，初值类型决定了累加结果的类型（写 0 就是整数除法）。
- 范围 for 配结构化绑定 `for (const auto& [key, value] : m)` 能在遍历 map 时省掉 .first/.second，用 const 引用可避免拷贝。

**阅读**：《C++ Primer（第 5 版）》第 14 章 14.8 函数对象、第 10 章 10.3.3 lambda 捕获和返回；cppreference: std::function、std::accumulate、Structured binding

**动手**

- 写一个仿函数 ByLength，再写一个等价的 lambda，分别用于 sort 比较字符串长度并对比调用形式。
- 用 accumulate 求一组分数的总分与平均分，并用结构化绑定遍历 map<string,int> 打印名次表。

**完成标准**

- [ ] 能说出仿函数相对函数指针的两个优势
- [ ] accumulate 四个结果全部输出正确
- [ ] 会用结构化绑定遍历 map 并解释为什么用 const auto&
- [ ] 能说出 std::function 的类型擦除代价

**课后题（2 道）**

#### 第 1 题 · 仿函数与 std::function 传参（难度 2/3）

定义仿函数 `struct ByLength`，按「长度升序、长度相同按字典序升序」比较字符串；再实现 `void sort_with(const std::vector<std::string>& input, const std::function<bool(const std::string&, const std::string&)>& cmp)`，内部拷贝一份并用 cmp 排序后打印。main 中先用 ByLength{} 调用，再用「字典序降序」的 lambda 调用。验收：第一次输出按长度排序的结果，第二次输出逆字典序结果。

**提示**：std::function 能同时接住仿函数和 lambda；比较器要写成「第一个字段不等时立刻返回」的分层判断。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct ByLength {
    bool operator()(const std::string& a, const std::string& b) const {
        if (a.size() != b.size()) return a.size() < b.size();
        return a < b;
    }
};

void sort_with(const std::vector<std::string>& input,
               const std::function<bool(const std::string&, const std::string&)>& cmp) {
    std::vector<std::string> v = input;
    std::sort(v.begin(), v.end(), cmp);
    for (const std::string& s : v) std::cout << s << ' ';
    std::cout << std::endl;
}

int main() {
    std::vector<std::string> words{"lambda", "stl", "cpp", "algorithm", "vector"};
    sort_with(words, ByLength{});
    sort_with(words, [](const std::string& a, const std::string& b) { return a > b; });
}
```
仿函数的 operator() 声明为 const，才能被 std::function 里的常量对象调用。std::function 的代价是每次调用多一层间接（类型擦除），如果比较器只在局部使用，直接传 lambda 配合 auto 或模板参数性能更好。

</details>

#### 第 2 题 · accumulate 的三种用法（难度 3/3）

给定 `std::map<std::string,int> scores{{{"amy",80},{"bob",90},{"cy",70}}}` 与 `std::vector<std::string>{"cpp","algorithm","stl"}`：用 accumulate 求分数总和与平均分（注意用 0.0 作初值）、求出最长的字符串、再用一个带权重的仿函数求加权总分（权重 1.5）。最后用结构化绑定遍历 map 打印 `name=score`。验收：total=240、avg=80、longest=algorithm、weighted=360。

**提示**：map 的元素是 pair<const string,int>，累加时取 kv.second；求最长字符串时二元操作的初值用空 string，比较 a.size() 与 b.size() 后返回较长者。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <numeric>
#include <string>
#include <vector>

struct Weighted {
    double operator()(double acc, const std::pair<const std::string, int>& kv) const {
        return acc + kv.second * weight;
    }
    double weight;
};

int main() {
    std::map<std::string, int> scores{{"amy", 80}, {"bob", 90}, {"cy", 70}};
    std::vector<std::string> words{"cpp", "algorithm", "stl"};

    int total = std::accumulate(scores.begin(), scores.end(), 0,
        [](int acc, const std::pair<const std::string, int>& kv) { return acc + kv.second; });
    double avg = static_cast<double>(total) / scores.size();

    std::string longest = std::accumulate(words.begin(), words.end(), std::string(),
        [](const std::string& a, const std::string& b) {
            return a.size() >= b.size() ? a : b;
        });

    double weighted = std::accumulate(scores.begin(), scores.end(), 0.0, Weighted{1.5});

    std::cout << "total=" << total << " avg=" << avg
              << " longest=" << longest << " weighted=" << weighted << std::endl;

    for (const auto& [name, score] : scores) std::cout << name << '=' << score << ' ';
    std::cout << std::endl;
}
```
accumulate 的初值类型会一路决定中间结果类型：初值写 0 就全是整数运算，写 0.0 才能得到小数平均分。泛化到「任意二元操作」后，求和、求最值、拼接字符串都只是换一个可调用对象。

</details>

---

### 周六 · 复习与综合：把循环改写成算法管道 —— 复习 / 2 小时

**今天学什么**

- 所有泛型算法的通用语义是半开区间 [first,last)，理解这一点就能自己组合算法而不必记死每个签名。
- 把「只读筛选 → 改写映射 → 重排 → 累积统计」串成管道（count_if、transform、sort、accumulate），多段循环往往能压成几行。
- 谓词与比较器本质是数据：可以存进 std::function、可以按参数传入、也可以按运行期条件构造。
- 动手前先明确三件事：是否需要稳定顺序、是否需要保留原容器、是否只关心前 k 个结果，这三点直接决定选哪个算法。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.1 概述、10.3 定制操作、第 11 章 11.3 关联容器操作；cppreference: Algorithms library、std::max_element、std::partial_sort

**动手**

- 把上周写的某段手写循环统计代码改写成算法管道，记录代码行数的变化并检查输出是否一致。

**完成标准**

- [ ] 成绩报告四项输出与预期完全一致
- [ ] 词频前三为 the 3 / fox 2 / brown 1
- [ ] 至少把一段手写循环成功改写成算法组合
- [ ] 能说出选择 sort、partial_sort、nth_element 的判断依据

**课后题（2 道）**

#### 第 1 题 · 成绩分析报告（算法管道）（难度 2/3）

给定 `struct Rec{std::string name; int score;}` 与数据 amy:88、bob:95、cy:45、dan:72、eve:90：用 sort 按分数降序排名、用 max_element 找最高分、用 count_if 统计及格人数、用 accumulate 计算平均分。验收：排名为 bob(95) eve(90) amy(88) dan(72) cy(45)，best=bob、pass=4、avg=78。

**提示**：max_element 接受自定义比较器，语义是「返回第一个不小于其他元素的位置」；accumulate 的初值写 0.0 才能得到小数平均分。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

struct Rec {
    std::string name;
    int score;
};

int main() {
    std::vector<Rec> rs{{"amy", 88}, {"bob", 95}, {"cy", 45}, {"dan", 72}, {"eve", 90}};

    std::sort(rs.begin(), rs.end(), [](const Rec& a, const Rec& b) { return a.score > b.score; });

    auto best = std::max_element(rs.begin(), rs.end(),
        [](const Rec& a, const Rec& b) { return a.score < b.score; });

    int pass = static_cast<int>(std::count_if(rs.begin(), rs.end(),
        [](const Rec& r) { return r.score >= 60; }));

    double avg = std::accumulate(rs.begin(), rs.end(), 0.0,
        [](double acc, const Rec& r) { return acc + r.score; }) / static_cast<double>(rs.size());

    std::cout << "rank: ";
    std::for_each(rs.begin(), rs.end(), [](const Rec& r) {
        std::cout << r.name << '(' << r.score << ") ";
    });
    std::cout << std::endl;
    std::cout << "best=" << best->name << " pass=" << pass << " avg=" << avg << std::endl;
}
```
四个统计各由一个算法承担，职责单一、互不干扰，比一个循环里塞满标志位更易读也更容易改。max_element 返回迭代器，注意先用空判断再解引用，示例数据非空所以直接访问 best->name。

</details>

#### 第 2 题 · 用算法实现词频前三（难度 3/3）

给定文本 `the quick brown fox jumps over the lazy dog the fox`：用 unordered_map 统计词频，把结果搬进 vector，用 sort 按「次数降序、次数相同按字典序升序」排序，再用 for_each 打印前 3 项。验收：输出三行 `the 3`、`fox 2`、`brown 1`。

**提示**：从 map 构造 vector 可直接用迭代器区间构造函数；排名前三要先用 std::min 把 3 和 items.size() 取小，避免元素不足时越界。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

int main() {
    const std::string text = "the quick brown fox jumps over the lazy dog the fox";
    std::unordered_map<std::string, int> freq;
    std::istringstream in(text);
    std::string w;
    while (in >> w) ++freq[w];

    std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
    std::sort(items.begin(), items.end(),
        [](const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) {
            if (a.second != b.second) return a.second > b.second;
            return a.first < b.first;
        });

    std::size_t k = std::min<std::size_t>(3, items.size());
    std::for_each(items.begin(), items.begin() + static_cast<std::ptrdiff_t>(k),
        [](const std::pair<std::string, int>& p) {
            std::cout << p.first << ' ' << p.second << std::endl;
        });
}
```
unordered_map 负责计数、vector 负责排序、算法负责取前 k 个，这正是「容器 + 算法」的分工方式。比较器第二行处理平局，保证输出可复现；实际取前 k 个时用 partial_sort 可以少做无用的排序。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回顾本周主线：算法只认迭代器区间和可调用对象——掌握这两样，就能把绝大多数「手写 for 循环」换成声明式的算法组合。

**阅读**：《C++ Primer（第 5 版）》第 10 章 10.1 概述（复习算法与容器的解耦关系）；cppreference: Algorithms library

**动手**

- 可选任务：挑自己写过的一个循环统计函数，用算法重写并对比可读性；同时记录哪类逻辑不适合用算法表达。

**完成标准**

- [ ] 回顾本周内容，能说出四类算法的代表函数
- [ ] 输出 5050 与平方示例 1 4 10000
- [ ] 列出下周想重点攻克的两个 STL 盲点

**课后题（1 道）**

#### 第 1 题 · 热身：iota、accumulate 与 transform（难度 1/3）

用 `std::iota` 把 `std::vector<int>`（大小 100）填成 1 到 100；用 accumulate 求总和；用 transform 生成同样大小的平方表，并打印总和与前两个、最后一个平方值。验收：总和为 5050，平方示例为 1、4、10000。

**提示**：iota 需要 <numeric>，第三个参数是起始值；transform 的输出区间要提前准备好同样大小，直接写 sq.begin() 作为目标。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> v(100);
    std::iota(v.begin(), v.end(), 1);

    int sum = std::accumulate(v.begin(), v.end(), 0);

    std::vector<int> sq(v.size());
    std::transform(v.begin(), v.end(), sq.begin(), [](int x) { return x * x; });

    std::cout << "sum 1..100 = " << sum << std::endl;
    std::cout << "squares: " << sq[0] << ' ' << sq[1] << ' ' << sq[99] << std::endl;
}
```
iota 与 accumulate 都在 <numeric> 里，不属于 <algorithm>，这是初学时最容易找错头文件的地方。transform 的目标区间必须已有足够空间（这里用 v 的大小构造 sq），它不会自动扩容。

</details>

---

## 第 7 周 · 模板与泛型编程

**本周目标**：能写出可复用的函数模板与类模板，理解特化、可变参数、非类型参数，并会用 constexpr 与 concepts 表达约束。

### 周一 · 函数模板与类型推导 —— 学习 / 1.5 小时

**今天学什么**

- 函数模板用 template <typename T> 声明，编译器在调用点根据实参推导 T 并实例化出一个普通函数，模板本身不生成任何代码。
- 推导规则跟着形参形式走：按值传参 T 会丢掉顶层 const 与引用，按 const T& 传参保留类型信息，数组与函数名按值传参会退化成指针。
- 显式指定模板实参（如 my_max<double>(1, 2)）可以覆盖推导结果，也是返回类型无法从参数推导时的常用手段。
- 模板定义通常必须写在头文件里：每个使用它的翻译单元都要看到完整定义才能实例化，否则链接阶段会报未定义符号。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.1 定义模板、16.2 模板实参推断；cppreference: Templates、Function template

**动手**

- 实现自己的 my_max 与 my_swap（不调用 std::swap），并各写一次显式指定模板实参的调用。
- 写模板函数 print_all 打印任意容器，再尝试传一个 C 数组并解释为什么推导失败。

**完成标准**

- [ ] 能说清模板在什么时刻被实例化、为什么定义要放头文件
- [ ] 两道题的输出与预期一致（3、7、banana、2 与 3、1）
- [ ] 能举出至少一种会导致模板推导失败的调用写法
- [ ] 理解显式指定模板实参的作用

**课后题（2 道）**

#### 第 1 题 · 三个版本的 my_max（难度 1/3）

实现 `template <typename T> T my_max(const T& a, const T& b)` 与三参数版本 `T my_max(const T& a, const T& b, const T& c)`（三参数版本内部复用两参数版本）。要求：(1) 用 int、double、std::string 各调用一次并打印结果；(2) 用 `my_max<double>(1, 2)` 显式指定类型调用一次，说明它与不指定时的差别。

**提示**：比较用 a < b 即可，不要写 a <= b；三参数版本可以先 m = my_max(a,b)，再 my_max(m,c)。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>

template <typename T>
T my_max(const T& a, const T& b) {
    return a < b ? b : a;
}

template <typename T>
T my_max(const T& a, const T& b, const T& c) {
    return my_max(my_max(a, b), c);
}

int main() {
    std::cout << my_max(3, 7) << std::endl;
    std::cout << my_max(2.5, 1.5) << std::endl;
    std::cout << my_max(std::string("apple"), std::string("banana")) << std::endl;
    std::cout << my_max<double>(1, 2) << std::endl;
}
```
显式指定 double 时，两个 int 实参会被隐式转换成 double 再比较，结果类型是 double（打印为 2）。如果不指定类型，my_max(1, 2) 会实例化成 int 版本。三参数版本复用两参数版本，体现了模板天然的复用能力。

</details>

#### 第 2 题 · 泛型阈值计数（难度 2/3）

实现 `template <typename T> std::size_t count_greater(const std::vector<T>& v, const T& threshold)`，返回区间内严格大于 threshold 的元素个数。要求用 `std::vector<int>{1,5,9,3,12}` 与阈值 4 得到 3，再用 `std::vector<std::string>{"apple","pear","kiwi"}` 与阈值 "kiwi" 按字典序比较得到 1（pear）。

**提示**：元素类型和阈值类型必须是同一个 T，才能保证比较合法；遍历用 const auto& 或 const T&，计数用 std::size_t。

<details>
<summary>参考答案</summary>

```cpp
#include <cstddef>
#include <iostream>
#include <string>
#include <vector>

template <typename T>
std::size_t count_greater(const std::vector<T>& v, const T& threshold) {
    std::size_t n = 0;
    for (const T& x : v) {
        if (threshold < x) ++n;
    }
    return n;
}

int main() {
    std::vector<int> nums{1, 5, 9, 3, 12};
    std::cout << count_greater(nums, 4) << std::endl;

    std::vector<std::string> words{"apple", "pear", "kiwi"};
    std::cout << count_greater(words, std::string("kiwi")) << std::endl;
}
```
同一个模板对 int 和 std::string 都能工作，因为二者都支持 operator<。注意阈值参数写成 const T& 时，传字符串字面量会导致 T 推导冲突（const char* 与 std::string），所以示例显式构造了 std::string，这也是模板推导最常见的坑之一。

</details>

---

### 周二 · 类模板与默认模板参数 —— 学习 / 1.5 小时

**今天学什么**

- 类模板用 template <typename T> class Box 定义，类外定义成员函数要重复写 template <typename T> 并用 Box<T>:: 限定作用域。
- 默认模板参数（如 template <typename T, typename C = std::vector<T>>）让常见用法不必写全参数，std::vector 的第二个参数就是这种设计。
- 类模板实参推导（CTAD）让 std::pair p{1, 2.0} 这样的写法成立，自定义模板要享受它通常需要一个推导指引。
- 别名模板 `template <typename T> using Vec = std::vector<T>;` 可以给长模板名起短名字，比 typedef 更适合模板。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.1.2 类模板、16.1.3 模板参数；cppreference: Class template、Class template argument deduction

**动手**

- 实现类模板 Stack<T>，提供 push/pop/top/empty/size，并用 int 与 std::string 两种类型实例化测试。
- 给 Stack 增加第二个模板参数 Container（默认 std::vector<T>），换成 std::deque<T> 再测试一遍。

**完成标准**

- [ ] 能写出类模板成员函数的定义方式，并解释类模板为什么不能单独编译
- [ ] Stack 的 int 与 string 两个实例都正确工作，异常被捕获
- [ ] 能解释默认模板参数在实例化时的生效规则
- [ ] 知道 std::stack 的第二个模板参数就是底层容器

**课后题（2 道）**

#### 第 1 题 · 实现类模板 Stack（难度 1/3）

实现 `template <typename T> class Stack`：成员函数 push(const T&)、pop()（返回被弹出的值，空栈时抛 std::out_of_range）、top() const、empty() const、size() const。main 中分别用 int 与 std::string 各实例化一个栈，压入若干元素后依次 pop 打印；再对空栈调用一次 pop 并捕获异常。验收：int 栈按后进先出输出，string 栈同理，异常被捕获并打印 what()。

**提示**：pop 要先判空再取 back() 然后 pop_back()，顺序反了会读到无效元素；成员函数定义写在类内即可，无需重复模板头。

<details>
<summary>参考答案</summary>

```cpp
#include <cstddef>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& value) { data_.push_back(value); }

    T pop() {
        if (data_.empty()) throw std::out_of_range("pop on empty Stack");
        T value = data_.back();
        data_.pop_back();
        return value;
    }

    const T& top() const {
        if (data_.empty()) throw std::out_of_range("top on empty Stack");
        return data_.back();
    }

    bool empty() const { return data_.empty(); }
    std::size_t size() const { return data_.size(); }

private:
    std::vector<T> data_;
};

int main() {
    Stack<int> si;
    si.push(1);
    si.push(2);
    si.push(3);
    while (!si.empty()) std::cout << si.pop() << ' ';
    std::cout << std::endl;

    Stack<std::string> ss;
    ss.push("cpp");
    ss.push("template");
    std::cout << ss.top() << " size=" << ss.size() << std::endl;

    try {
        Stack<int> empty_stack;
        empty_stack.pop();
    } catch (const std::out_of_range& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }
}
```
类模板不是类，Stack<int> 与 Stack<std::string> 才是编译器实例化出的两个互不相关的类型。pop 先取值再 pop_back 是关键顺序；把异常类型定为 std::out_of_range 与标准库容器保持一致（如 vector::at 的行为）。

</details>

#### 第 2 题 · 用第二个模板参数换底层容器（难度 2/3）

把 Stack 改成 `template <typename T, typename Container = std::vector<T>> class Stack`，内部改用 `Container data_`，其余接口不变。要求用默认参数实例化一个 `Stack<int>`，再用 `Stack<int, std::deque<int>>` 实例化一个，各自压入 1、2、3 后 pop 打印，验证两种底层容器行为一致。

**提示**：vector 与 deque 都提供 push_back/pop_back/back/empty/size，因此模板代码不必修改；默认参数只在没写第二个实参时生效。

<details>
<summary>参考答案</summary>

```cpp
#include <cstddef>
#include <deque>
#include <iostream>
#include <stdexcept>
#include <vector>

template <typename T, typename Container = std::vector<T>>
class Stack {
public:
    void push(const T& value) { data_.push_back(value); }

    T pop() {
        if (data_.empty()) throw std::out_of_range("pop on empty Stack");
        T value = data_.back();
        data_.pop_back();
        return value;
    }

    const T& top() const {
        if (data_.empty()) throw std::out_of_range("top on empty Stack");
        return data_.back();
    }

    bool empty() const { return data_.empty(); }
    std::size_t size() const { return data_.size(); }

private:
    Container data_;
};

int main() {
    Stack<int> a;
    a.push(1);
    a.push(2);
    a.push(3);
    while (!a.empty()) std::cout << a.pop() << ' ';
    std::cout << std::endl;

    Stack<int, std::deque<int>> b;
    b.push(1);
    b.push(2);
    b.push(3);
    while (!b.empty()) std::cout << b.pop() << ' ';
    std::cout << std::endl;
    std::cout << "size now=" << b.size() << std::endl;
}
```
把「存什么」和「用什么存」拆成两个独立的模板参数，是标准库容器适配器 std::stack 的真实做法（它是 `template <class T, class Container = std::deque<T>>`）。默认参数让绝大多数调用者只写第一个实参，接口复杂度不外泄。

</details>

---

### 周三 · 模板特化、偏特化与 traits —— 学习 / 1.5 小时

**今天学什么**

- 全特化 (template <> class Box<bool>) 为某个具体类型提供完全不同的实现，它不再从主模板推导任何参数。
- 偏特化只固定一部分模板参数（如 template <typename T> class Box<T*>），用来对指针、引用、容器等一类类型统一处理。
- 类型萃取（traits）正是靠特化实现的：std::remove_reference<T>::type、std::is_same<A,B>::value 都在编译期给出答案。
- 函数模板不能偏特化，只能重载或全特化；特化必须出现在任何使用它的实例化之前，否则会违反 ODR 引发诡异链接错误。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.5 模板特例化；cppreference: Template specialization、Standard library header <type_traits>

**动手**

- 给自定义 Printer<T> 写 bool 全特化与 T* 偏特化，分别打印布尔值与指针内容，观察三份实现的分工。
- 用 std::is_same 与 std::remove_reference 做编译期判断并打印结果。

**完成标准**

- [ ] 能说出全特化与偏特化的区别，以及函数模板为什么不能偏特化
- [ ] Printer 的四次调用命中预期实现，指针地址打印正确
- [ ] traits 输出全对，is_same 结果为 1 与 0
- [ ] 能解释为什么 traits 不产生运行期开销

**课后题（2 道）**

#### 第 1 题 · Printer 的全特化与偏特化（难度 2/3）

定义主模板 `template <typename T> class Printer`，静态成员函数 print(const T&) 打印 `generic: 值`；再写全特化 `Printer<bool>` 打印 `bool: true/false`，以及偏特化 `Printer<T*>` 打印 `pointer: 地址 -> 值`（空指针只打印地址并标注 null）。main 中分别用 int、bool、int* 和 nullptr 调用一次。验收：四次调用分别命中三份不同实现。

**提示**：全特化写 template <>，偏特化写 template <typename T> class Printer<T*>；打印地址时用 static_cast<const void*> 避免把 char* 当字符串输出。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

template <typename T>
class Printer {
public:
    static void print(const T& value) {
        std::cout << "generic: " << value << std::endl;
    }
};

template <>
class Printer<bool> {
public:
    static void print(bool value) {
        std::cout << "bool: " << (value ? "true" : "false") << std::endl;
    }
};

template <typename T>
class Printer<T*> {
public:
    static void print(T* value) {
        std::cout << "pointer: " << static_cast<const void*>(value);
        if (value == nullptr) std::cout << " (null)";
        else std::cout << " -> " << *value;
        std::cout << std::endl;
    }
};

int main() {
    int x = 42;
    Printer<int>::print(x);
    Printer<bool>::print(true);
    Printer<int*>::print(&x);
    Printer<int*>::print(nullptr);
}
```
全特化 Printer<bool> 与主模板是两个完全独立的类，编译器不会再为它推导 T；偏特化 Printer<T*> 对「所有指针类型」统一生效，T 仍按实参推导。打印地址时若不强转成 const void*，char* 会被当成 C 字符串输出；特化必须写在任何使用该类型的代码之前。

</details>

#### 第 2 题 · 用 traits 在编译期回答类型问题（难度 3/3）

写函数模板 `template <typename T> void describe(const std::string& name)`，打印 T 是否为指针、是否为引用、是否为整型（用 std::is_pointer / std::is_reference / std::is_integral 的 ::value）。main 中依次对 int、int*、int&、std::string 调用；再用 std::remove_reference 把 int& 变成 int，用 std::is_same 验证它确实等于 int，并打印 is_same<int,long> 的结果。验收：int 为 integral，int* 为 pointer，int& 为 reference，remove_reference 后的比较为 1。

**提示**：traits 的 ::value 是编译期常量，可以像普通布尔值一样参与输出；std::is_same<A,B>::value 判断两个类型是否完全相同（const 与引用都算不同）。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <type_traits>

template <typename T>
void describe(const std::string& name) {
    std::cout << name
              << " is_pointer=" << std::is_pointer<T>::value
              << " is_reference=" << std::is_reference<T>::value
              << " is_integral=" << std::is_integral<T>::value
              << std::endl;
}

int main() {
    describe<int>("int");
    describe<int*>("int*");
    describe<int&>("int&");
    describe<std::string>("std::string");

    using NoRef = std::remove_reference<int&>::type;
    std::cout << "remove_reference<int&> == int: "
              << std::is_same<NoRef, int>::value << std::endl;
    std::cout << "is_same<int, long>: " << std::is_same<int, long>::value << std::endl;
}
```
每个 traits 都是一个带 ::value 的类模板，标准库用特化让它在编译期给出答案，运行期没有任何开销。std::remove_reference<int&>::type 就是 int，这类「类型变换」是写通用库代码的基本积木；C++17 起可以写 std::remove_reference_t<int&> 更简洁。

</details>

---

### 周四 · 可变参数模板、折叠表达式与非类型参数 —— 学习 / 1.5 小时

**今天学什么**

- 可变参数模板用 template <typename... Ts> 接收任意个类型，函数形参写成 Ts... args，sizeof...(args) 在编译期给出参数个数。
- C++17 折叠表达式把参数包压缩成一行：(args + ...) 求和，((std::cout << args), ...) 逐个输出，不必再写递归终止函数。
- 非类型模板参数（template <std::size_t N>）把数值写进类型里，std::array 与定长缓冲区都靠它实现零开销的固定容量。
- 参数包本身不是容器，只能用展开语法消费：折叠表达式、初始化列表、或再传给另一个可变参数模板。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.4 可变参数模板；cppreference: Parameter pack、Fold expression、Non-type template parameter

**动手**

- 写可变参数函数模板 sum_all 与 print_all，分别用折叠表达式求和、逐个打印。
- 写类模板 FixedBuffer<T,N>，用 std::array 做底层，容量满时抛 std::length_error。

**完成标准**

- [ ] 能写出一元与逗号两种折叠表达式
- [ ] sum_all 三个结果分别为 10、4、3.5
- [ ] FixedBuffer 容量与越界两个异常都被捕获
- [ ] 能解释非类型模板参数与运行期常量的差别

**课后题（2 道）**

#### 第 1 题 · 折叠表达式版的 sum_all 与 print_all（难度 2/3）

实现 `template <typename... Ts> auto sum_all(Ts... args)` 用一元折叠表达式求和（要求返回类型自动推导，`sum_all(1,2,3,4)` 得 10、`sum_all(1.5,2.5)` 得 4、`sum_all(1,2.5)` 得 3.5）；再实现 `template <typename... Ts> void print_all(const Ts&... args)`，先打印 `count=N` 再用逗号折叠逐个输出参数。main 中用混合类型调用 print_all，并用 std::common_type_t 验证 int 与 double 的公共类型是 double。

**提示**：求和写 `return (args + ...);`，逐个输出写 `((std::cout << args << ' '), ...);`；sizeof...(args) 是编译期常量，可直接打印。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <type_traits>

template <typename... Ts>
auto sum_all(Ts... args) {
    return (args + ...);
}

template <typename... Ts>
void print_all(const Ts&... args) {
    std::cout << "count=" << sizeof...(args) << ": ";
    ((std::cout << args << ' '), ...);
    std::cout << std::endl;
}

int main() {
    std::cout << sum_all(1, 2, 3, 4) << std::endl;
    std::cout << sum_all(1.5, 2.5) << std::endl;
    std::cout << sum_all(1, 2.5) << std::endl;

    print_all(1, "two", std::string("three"), 4.5);

    std::cout << "common_type<int,double> is double: "
              << std::is_same<std::common_type_t<int, double>, double>::value << std::endl;
}
```
(auto) 返回类型让 sum_all 按折叠结果推导：全 int 得 int，混合得 double，这就是模板推导与算术类型提升共同作用的结果。逗号折叠 ((expr), ...) 常用来「对每个参数做一次带副作用的操作」，比写递归展开干净得多。

</details>

#### 第 2 题 · 定长缓冲区 FixedBuffer（难度 3/3）

实现 `template <typename T, std::size_t N> class FixedBuffer`：内部用 `std::array<T, N>` 存数据；push_back(const T&) 在已满时抛 std::length_error；operator[](std::size_t) const 越界抛 std::out_of_range；size() 返回当前元素数；静态 constexpr capacity() 返回 N。main 中用 N=3 压满后触发一次扩容异常，再打印 buf[1] 并触发一次越界异常。验收：size=3、capacity=3，两个异常都被捕获。

**提示**：容量 N 是编译期常量，所以 std::array<T,N> 可以直接作为成员；当前元素个数必须单独用一个 size_ 记录，不能用 data_.size()（它永远是 N）。

<details>
<summary>参考答案</summary>

```cpp
#include <array>
#include <cstddef>
#include <iostream>
#include <stdexcept>

template <typename T, std::size_t N>
class FixedBuffer {
public:
    void push_back(const T& value) {
        if (size_ >= N) throw std::length_error("FixedBuffer is full");
        data_[size_] = value;
        ++size_;
    }

    const T& operator[](std::size_t i) const {
        if (i >= size_) throw std::out_of_range("FixedBuffer index out of range");
        return data_[i];
    }

    std::size_t size() const { return size_; }
    static constexpr std::size_t capacity() { return N; }

private:
    std::array<T, N> data_{};
    std::size_t size_ = 0;
};

int main() {
    FixedBuffer<int, 3> buf;
    buf.push_back(10);
    buf.push_back(20);
    buf.push_back(30);
    std::cout << "size=" << buf.size()
              << " capacity=" << FixedBuffer<int, 3>::capacity() << std::endl;

    try {
        buf.push_back(40);
    } catch (const std::length_error& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }

    std::cout << "buf[1]=" << buf[1] << std::endl;
    try {
        std::cout << buf[5] << std::endl;
    } catch (const std::out_of_range& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }
}
```
非类型模板参数把 N 编进类型，FixedBuffer<int,3> 与 FixedBuffer<int,5> 是两个不同类，数组大小在编译期就能确定、没有动态分配开销。std::array 的 size() 恒为 N，所以「已用个数」必须自己维护。

</details>

---

### 周五 · SFINAE、concepts 与 constexpr —— 练习 / 1.5 小时

**今天学什么**

- SFINAE（替换失败并非错误）指模板参数替换失败时该候选被静默移除，std::enable_if 正是利用它做「只在满足条件时才启用这个重载」。
- C++20 的 concept 把这种约束写成可读的类型谓词（template <std::integral T> 或 requires 子句），编译错误信息也从一屏变成一句话。
- constexpr 函数既能在编译期求值也能在运行期调用，把计算搬到编译期可以减少运行开销，还能用于 static_assert 与数组长度等常量语境。
- if constexpr 在编译期丢弃不成立的分支，因此被丢弃分支里的代码即使对当前类型不合法也不会报错，比 SFINAE 标签分发直观得多。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.2.3 尾置返回类型与类型转换、16.4 可变参数模板（含模板约束思想）；cppreference: SFINAE、Constraints and concepts、constexpr

**动手**

- 写 enable_if 版本的两个互斥重载（只接受整型 / 只接受非整型），再用等价写法实现一次并对比可读性。
- 写 constexpr 阶乘并用 static_assert 验证，再写 if constexpr 版本的类型分类函数。

**完成标准**

- [ ] 能解释 SFINAE 的含义，以及 enable_if 为什么写在返回类型位置
- [ ] describe_type 三行输出正确
- [ ] static_assert 通过，kind 三行输出正确
- [ ] 能说出 if constexpr 与普通 if 在实例化行为上的区别

**课后题（2 道）**

#### 第 1 题 · 用 enable_if 做互斥重载（难度 2/3）

实现两个重载函数 `describe_type(T)`，都返回 std::string：当 T 是整型时返回 `integral`，否则返回 `other`。要求两个重载通过 `std::enable_if` 的条件互斥（不能只靠返回类型不同而无法区分）。main 中分别用 42、3.14、std::string("hi") 调用并打印。验收：输出 integral、other、other 三行。

**提示**：把 enable_if 写在返回类型位置：`typename std::enable_if<std::is_integral<T>::value, std::string>::type`；第二个重载条件取反。两个重载的形参列表完全相同，靠返回类型位置的替换失败来二选一。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <type_traits>

template <typename T>
typename std::enable_if<std::is_integral<T>::value, std::string>::type
describe_type(T) {
    return "integral";
}

template <typename T>
typename std::enable_if<!std::is_integral<T>::value, std::string>::type
describe_type(T) {
    return "other";
}

int main() {
    std::cout << describe_type(42) << std::endl;
    std::cout << describe_type(3.14) << std::endl;
    std::cout << describe_type(std::string("hi")) << std::endl;
}
```
enable_if<cond, T> 在 cond 为真时才有嵌套 type，条件不成立时替换失败，该重载被静默移出候选集，于是另一份顶上。C++20 里可以写成 `template <std::integral T> std::string describe_type(T)`，语义相同但可读性和报错信息都好得多。

</details>

#### 第 2 题 · constexpr 与 if constexpr（难度 3/3）

写 `constexpr int factorial(int n)`（递归实现）并用 `static_assert(factorial(5) == 120, "...")` 在编译期验证；再写 `template <typename T> std::string kind(T)`，用 if constexpr 把类型分成 integral / floating / other 三类。main 中打印 factorial(5) 与 kind(1)、kind(1.5)、kind(std::string("x"))。验收：static_assert 通过，输出 120 与 integral floating other。

**提示**：constexpr 函数体在 C++14 起允许局部变量与分支；if constexpr 的三个分支按 std::is_integral / std::is_floating_point 判断，被丢弃的分支不会实例化。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <type_traits>

constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

static_assert(factorial(5) == 120, "factorial(5) must be 120");

template <typename T>
std::string kind(T) {
    if constexpr (std::is_integral<T>::value) {
        return "integral";
    } else if constexpr (std::is_floating_point<T>::value) {
        return "floating";
    } else {
        return "other";
    }
}

int main() {
    std::cout << "factorial(5)=" << factorial(5) << std::endl;
    std::cout << kind(1) << ' ' << kind(1.5) << ' ' << kind(std::string("x")) << std::endl;
}
```
static_assert 要求表达式是编译期常量，因此它同时验证了 factorial 真的是 constexpr 函数。if constexpr 在实例化时只保留成立的分支，所以 kind 对没有算术运算能力的 std::string 也不会报错，这正是它替代 SFINAE 的关键价值。

</details>

---

### 周六 · 复习与综合：从函数模板到泛型组件 —— 复习 / 2 小时

**今天学什么**

- 模板的三层用法：函数模板解决「逻辑复用」，类模板解决「数据结构复用」，traits 与 concepts 解决「对类型提出要求」。
- 模板代码的报错通常发生在实例化点而不是定义点，读错误信息要优先看「哪个模板参数、哪一行实例化」。
- 非类型模板参数让容量、维度这类编译期已知的量变成类型的一部分，换来零开销与更强的类型检查。
- 写泛型组件时先问三件事：类型需要支持哪些操作、需不需要特化行为、错误在编译期还是运行期暴露，答案决定用 concepts、traits 还是运行时异常。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.1 定义模板、16.4 可变参数模板、16.5 模板特例化（整体复习）；cppreference: Templates、Constraints and concepts

**动手**

- 把本周写的 Stack<T> 与 FixedBuffer<T,N> 合起来看：同一个「容器」概念可以用两种完全不同的容量策略实现，记录两者的取舍。

**完成标准**

- [ ] 直方图两版输出与预期一致，print_map 用了结构化绑定
- [ ] Matrix 的 at/operator+/transpose 全部跑通，转置维度正确
- [ ] 能总结出函数模板、类模板、traits/concepts 各自解决的问题
- [ ] 能说出模板报错时应该先看什么信息

**课后题（2 道）**

#### 第 1 题 · 泛型直方图统计（难度 2/3）

实现 `template <typename T> std::map<T, int> histogram(const std::vector<T>& v)`，返回每个值出现的次数；再用一个辅助函数 `template <typename K, typename V> void print_map(const std::map<K,V>& m)` 用结构化绑定打印 `key:count`。要求分别用 `std::vector<int>{1,2,2,3,3,3}` 与 `std::vector<std::string>{"a","b","a"}` 调用。验收：int 版本输出 1:1、2:2、3:3，string 版本输出 a:2、b:1。

**提示**：直方图直接 ++result[value] 即可；print_map 用 `for (const auto& [k, v] : m)`，注意 map 本身保证了键的有序输出。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>

template <typename T>
std::map<T, int> histogram(const std::vector<T>& v) {
    std::map<T, int> result;
    for (const T& x : v) ++result[x];
    return result;
}

template <typename K, typename V>
void print_map(const std::map<K, V>& m) {
    for (const auto& [key, count] : m) std::cout << key << ':' << count << ' ';
    std::cout << std::endl;
}

int main() {
    std::vector<int> nums{1, 2, 2, 3, 3, 3};
    print_map(histogram(nums));

    std::vector<std::string> words{"a", "b", "a"};
    print_map(histogram(words));
}
```
模板参数 T 要求支持 operator< 与 operator++（int 计数），这些隐式要求就是标准库用 concepts 显式写出来的东西。两个函数模板各自独立推导、互相配合，这种「小模板拼装」是泛型代码的常见形态。

</details>

#### 第 2 题 · 带非类型参数的矩阵类（难度 3/3）

实现 `template <typename T, std::size_t R, std::size_t C> class Matrix`：内部用 `std::array<T, R*C>`，提供 at(r,c)（越界抛 std::out_of_range）、operator+（同维度相加）、transpose()（返回 `Matrix<T, C, R>`）、print()。main 中构造 `Matrix<int,2,3>` 填入 1..6，打印它、打印它与另一个矩阵的和、打印它的转置。验收：转置结果为 3 行 2 列（1 4 / 2 5 / 3 6）。

**提示**：一维存储用 r * C + c 定位；transpose 的返回类型是 Matrix<T, C, R>，在类模板内部可以直接写 Matrix<T, C, R>；operator+ 里 `Matrix out;` 指的就是当前实例类型。

<details>
<summary>参考答案</summary>

```cpp
#include <array>
#include <cstddef>
#include <iostream>
#include <stdexcept>

template <typename T, std::size_t R, std::size_t C>
class Matrix {
public:
    Matrix() { data_.fill(T{}); }

    T& at(std::size_t r, std::size_t c) {
        if (r >= R || c >= C) throw std::out_of_range("Matrix index out of range");
        return data_[r * C + c];
    }

    const T& at(std::size_t r, std::size_t c) const {
        if (r >= R || c >= C) throw std::out_of_range("Matrix index out of range");
        return data_[r * C + c];
    }

    Matrix operator+(const Matrix& other) const {
        Matrix out;
        for (std::size_t i = 0; i < R * C; ++i) out.data_[i] = data_[i] + other.data_[i];
        return out;
    }

    Matrix<T, C, R> transpose() const {
        Matrix<T, C, R> out;
        for (std::size_t r = 0; r < R; ++r)
            for (std::size_t c = 0; c < C; ++c) out.at(c, r) = at(r, c);
        return out;
    }

    void print() const {
        for (std::size_t r = 0; r < R; ++r) {
            for (std::size_t c = 0; c < C; ++c) std::cout << at(r, c) << ' ';
            std::cout << std::endl;
        }
    }

private:
    std::array<T, R * C> data_;
};

int main() {
    Matrix<int, 2, 3> m;
    int v = 1;
    for (std::size_t r = 0; r < 2; ++r)
        for (std::size_t c = 0; c < 3; ++c) m.at(r, c) = v++;
    m.print();

    Matrix<int, 2, 3> n;
    n.at(0, 0) = 100;
    (m + n).print();

    m.transpose().print();
}
```
维度写成非类型模板参数后，矩阵大小成为类型的一部分：不同维度的矩阵相加会在编译期被拒绝，越界检查则是运行期兜底。transpose 返回另一个类型 Matrix<T,C,R>，这是模板能表达「类型级别转换」的直观例子。

</details>

---

### 周日 · 休息与回顾 —— 机动 / 30 分钟

**今天学什么**

- 回顾本周主线：模板把「类型」变成参数，函数模板复用逻辑、类模板复用结构、特化与 concepts 描述类型必须满足的条件。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.1 定义模板（复习模板实例化与头文件的关系）；cppreference: Templates

**动手**

- 可选任务：把本周的 FixedBuffer 与 Stack 合并成一个「可选固定容量」的容器，记录需要新增哪些模板参数与成员。

**完成标准**

- [ ] 回顾本周，能说出模板参数推导、特化、非类型参数三个要点
- [ ] clamp_value 三种类型调用输出 3、2、0.5
- [ ] 记录下周想重点掌握的现代 C++ 特性（移动语义、optional/variant、并发）

**课后题（1 道）**

#### 第 1 题 · 热身：一个泛型区间限制函数（难度 1/3）

实现 `template <typename T> T clamp_value(const T& v, const T& lo, const T& hi)`：小于 lo 返回 lo、大于 hi 返回 hi、否则返回 v。要求先用 int 测试 clamp_value(5,1,3) 得 3、clamp_value(2,1,3) 得 2，再用 double 测试 clamp_value(0.5,0.0,1.0) 得 0.5。

**提示**：用两个 if 依次处理上下界即可；不要用 std::clamp 抄答案，自己写一遍才能体会模板参数一致性要求（三个实参必须是同一 T）。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>

template <typename T>
T clamp_value(const T& v, const T& lo, const T& hi) {
    if (v < lo) return lo;
    if (hi < v) return hi;
    return v;
}

int main() {
    std::cout << clamp_value(5, 1, 3) << std::endl;
    std::cout << clamp_value(2, 1, 3) << std::endl;
    std::cout << clamp_value(0.5, 0.0, 1.0) << std::endl;
}
```
三个参数共用同一个 T，所以 clamp_value(5, 1.0, 3.0) 会推导失败——这是模板的「优点」：类型不一致的调用在编译期就被拦下。标准库的 std::clamp 在 C++17 已经提供，学会自己写是为了理解约束从哪来。

</details>

---

## 第 8 周 · 现代 C++ 综合实战

**本周目标**：掌握移动语义、完美转发与 C++17 值语义工具，写出一个带并发入门知识、含文件持久化的命令行通讯录项目。

### 周一 · 右值引用与移动语义 —— 学习 / 1.5 小时

**今天学什么**

- 左值有名字、可取地址，纯右值与将亡值属于右值；T&& 绑定右值就是右值引用，用来识别「可以被掏空」的对象。
- 移动构造/移动赋值把资源句柄从源对象转移过来并把源置空，省掉一次深拷贝；被移动后的对象处于有效但未指定的状态，只能赋新值或销毁。
- std::move 只是一次「到右值引用的类型转换」，它自己不移动任何东西，真正的转移发生在随后调用的移动构造或移动赋值里。
- 移动构造函数应当标 noexcept：vector 扩容时若元素的移动构造可能抛异常，标准库会退回使用拷贝构造来保证强异常安全。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.6 右值引用与移动语义、13.6.2 移动构造函数与移动赋值运算符；cppreference: std::move、Move constructor

**动手**

- 给一个持有裸指针的 Buffer 类补齐析构、拷贝构造、拷贝赋值、移动构造、移动赋值五个特殊成员函数，每步打印日志。
- 用 std::move 触发一次移动并打印源对象的状态，确认资源确实被转移而不是复制。

**完成标准**

- [ ] 能说出左值、右值、std::move 各自是什么
- [ ] Buffer 移动后源对象 empty() 为 true，程序无内存错误
- [ ] Fast 的 copied 为 0 而 Slow 的 copied 大于 0，能解释差别
- [ ] 能复述「被移动对象处于有效但未指定状态」的含义

**课后题（2 道）**

#### 第 1 题 · 五个特殊成员函数与一次真正的移动（难度 2/3）

实现类 `Buffer`：构造函数 `explicit Buffer(std::size_t n)` 在堆上申请 n 字节并打印 `ctor size=n`；五个特殊成员函数全部手写并打印各自名字（copy ctor / copy assign / move ctor / move assign / dtor）；提供 size() 与 empty()（empty 表示数据指针为空）。main 中依次执行拷贝构造、移动构造、移动赋值、拷贝赋值，并打印每一步之后源对象是否 empty、目标对象的 size。验收：移动之后源对象 empty() 为 true 且 size() 为 0，全程没有内存错误。

**提示**：移动构造直接接管指针并把源的指针置为 nullptr、size 置 0；移动赋值要先 delete 自己原有的数据（并自赋值判断），再接管。拷贝赋值建议先 new 再 delete，避免自我赋值时数据被提前释放。

<details>
<summary>参考答案</summary>

```cpp
#include <cstddef>
#include <cstring>
#include <iostream>
#include <utility>

class Buffer {
public:
    explicit Buffer(std::size_t n) : size_(n), data_(new char[n]) {
        std::cout << "ctor size=" << n << std::endl;
    }

    ~Buffer() {
        delete[] data_;
        std::cout << "dtor" << std::endl;
    }

    Buffer(const Buffer& other) : size_(other.size_), data_(new char[other.size_]) {
        std::memcpy(data_, other.data_, size_);
        std::cout << "copy ctor" << std::endl;
    }

    Buffer& operator=(const Buffer& other) {
        std::cout << "copy assign" << std::endl;
        if (this == &other) return *this;
        char* fresh = new char[other.size_];
        std::memcpy(fresh, other.data_, other.size_);
        delete[] data_;
        data_ = fresh;
        size_ = other.size_;
        return *this;
    }

    Buffer(Buffer&& other) noexcept : size_(other.size_), data_(other.data_) {
        other.data_ = nullptr;
        other.size_ = 0;
        std::cout << "move ctor" << std::endl;
    }

    Buffer& operator=(Buffer&& other) noexcept {
        std::cout << "move assign" << std::endl;
        if (this == &other) return *this;
        delete[] data_;
        data_ = other.data_;
        size_ = other.size_;
        other.data_ = nullptr;
        other.size_ = 0;
        return *this;
    }

    std::size_t size() const { return size_; }
    bool empty() const { return data_ == nullptr; }

private:
    std::size_t size_;
    char* data_;
};

int main() {
    Buffer a(4);
    Buffer b = a;
    std::cout << "after copy: b.size=" << b.size() << " a.empty=" << a.empty() << std::endl;

    Buffer c = std::move(a);
    std::cout << "after move ctor: c.size=" << c.size() << " a.empty=" << a.empty() << std::endl;

    Buffer d(2);
    d = std::move(c);
    std::cout << "after move assign: d.size=" << d.size() << " c.empty=" << c.empty() << std::endl;

    b = d;
    std::cout << "after copy assign: b.size=" << b.size() << std::endl;
}
```
移动的本质是「偷走指针 + 把源置空」，所以源对象仍可安全析构，不会出现 double free。拷贝赋值先分配再释放旧内存，即使 new 抛异常也不会破坏原对象，这是基本的异常安全写法；自赋值判断在两个赋值运算符中都不可省。

</details>

#### 第 2 题 · noexcept 移动如何影响 vector 扩容（难度 3/3）

定义两个统计型类：`Fast` 的移动构造与移动赋值标了 noexcept，`Slow` 的没标；两者的拷贝构造与拷贝赋值都让全局计数器 copied 加一，移动版本让 moved 加一。写模板函数 `fill(std::vector<T>&, int n)` 用 push_back 连续插入 n 个元素，分别对 `std::vector<Fast>` 与 `std::vector<Slow>` 插入 100 个元素并打印 moved/copied 次数。验收：Fast 的 copied 为 0，Slow 的 copied 明显大于 0，并能解释原因。

**提示**：vector 扩容时若元素的移动构造不保证 noexcept，标准库为保持强异常安全会改用拷贝；push_back 单个临时对象仍会走移动构造，所以 Slow 的 moved 也不为 0。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <vector>

struct Counter {
    static int moved;
    static int copied;
    static void reset() { moved = 0; copied = 0; }
};
int Counter::moved = 0;
int Counter::copied = 0;

class Fast {
public:
    Fast() = default;
    Fast(const Fast&) { ++Counter::copied; }
    Fast(Fast&&) noexcept { ++Counter::moved; }
    Fast& operator=(const Fast&) { ++Counter::copied; return *this; }
    Fast& operator=(Fast&&) noexcept { ++Counter::moved; return *this; }
};

class Slow {
public:
    Slow() = default;
    Slow(const Slow&) { ++Counter::copied; }
    Slow(Slow&&) { ++Counter::moved; }
    Slow& operator=(const Slow&) { ++Counter::copied; return *this; }
    Slow& operator=(Slow&&) { ++Counter::moved; return *this; }
};

template <typename T>
void fill(std::vector<T>& v, int n) {
    for (int i = 0; i < n; ++i) v.push_back(T{});
}

int main() {
    std::vector<Fast> f;
    Counter::reset();
    fill(f, 100);
    std::cout << "Fast: moved=" << Counter::moved << " copied=" << Counter::copied << std::endl;

    std::vector<Slow> s;
    Counter::reset();
    fill(s, 100);
    std::cout << "Slow: moved=" << Counter::moved << " copied=" << Counter::copied << std::endl;
}
```
扩容时 vector 需要把旧元素搬到新内存：Fast 的移动是 noexcept，直接移动；Slow 的移动可能抛异常，标准库为保持强异常安全改用拷贝，于是 copied 大量出现。把移动构造标成 noexcept 是廉价的性能开关，这也是 std::vector<std::string> 扩容很快的原因。

</details>

---

### 周二 · 完美转发与引用折叠 —— 学习 / 1.5 小时

**今天学什么**

- 在模板推导语境下 T&& 是转发引用（万能引用）：传左值时 T 推导为 U&，传右值时 T 推导为 U，因此同一个函数能同时接住两者。
- 引用折叠规则只有四种：& + & 得 &，其余组合（& + &&、&& + &、&& + &&）都折叠成 &&，这是万能引用能绑定左值的底层机制。
- std::forward<T>(arg) 按 T 的原始形态还原值类别，这才是「完美转发」；对万能引用参数写 std::move 会把传进来的左值也搬空，是常见事故。
- 转发函数模板配可变参数就是工厂函数的标准写法：make_xxx(Args&&... args) 内部用 std::forward<Args>(args)... 一次构造，值类别全程不丢。

**阅读**：《C++ Primer（第 5 版）》第 16 章 16.2.5 理解 std::move、16.2.6 理解 std::forward；cppreference: Reference declaration（引用折叠）、std::forward、std::make_unique

**动手**

- 实现自己的 make_thing 工厂模板（不调用 std::make_unique），用完美转发构造对象并返回 unique_ptr。
- 写一个转发包装函数，分别用 std::move 与 std::forward 转发同一个左值参数，观察调用者的变量是否被搬空。

**完成标准**

- [ ] 能写出四条引用折叠规则并解释万能引用的来历
- [ ] make_thing 三种传参方式行为正确，移动后原字符串为空
- [ ] categorize 五行输出符合预期
- [ ] 能说清 std::forward 与 std::move 的使用场合差异

**课后题（2 道）**

#### 第 1 题 · 自己的 make_unique（难度 2/3）

定义 `struct Person { Person(std::string name, int age); std::string name; int age; };`，实现 `template <typename T, typename... Args> std::unique_ptr<T> make_thing(Args&&... args)`，内部用 `new T(std::forward<Args>(args)...)` 构造并返回 unique_ptr。main 中分别用临时 std::string、左值 std::string、std::move(name) 三种方式各构造一个 Person，并在移动后打印原字符串确认它已被搬空。

**提示**：转发引用参数必须写 Args&&（不要写 const Args&），转发时必须写 std::forward<Args>(args)...；左值传参时 name 不会被移动，只有 std::move(name) 才会。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <utility>

struct Person {
    Person(std::string name, int age) : name(std::move(name)), age(age) {
        std::cout << "Person(" << this->name << "," << age << ")" << std::endl;
    }
    std::string name;
    int age;
};

template <typename T, typename... Args>
std::unique_ptr<T> make_thing(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}

int main() {
    auto p = make_thing<Person>(std::string("amy"), 30);
    std::cout << "p=" << p->name << ' ' << p->age << std::endl;

    std::string name = "bob";
    auto q = make_thing<Person>(name, 25);
    std::cout << "name still=[" << name << "] q=" << q->name << std::endl;

    auto r = make_thing<Person>(std::move(name), 20);
    std::cout << "name after move=[" << name << "] r=" << r->name << std::endl;
}
```
这一行 `new T(std::forward<Args>(args)...)` 就是标准库 make_unique 的核心：perfect forwarding 让左值仍以左值传递（走拷贝），右值以右值传递（走移动）。若把 std::forward 换成 std::move，左值参数在调用者不知情的情况下被搬空，这正是转发函数最容易犯的错。

</details>

#### 第 2 题 · 用转发引用识别值类别（难度 3/3）

实现 `template <typename T> void categorize(T&& value)`：用 `if constexpr (std::is_lvalue_reference_v<T>)` 判断并打印 `lvalue` 或 `rvalue`。main 中分别传入左值 int、const int 左值、字面量 5、std::move(左值)、字符串字面量，打印五行结果。验收：前两行与最后一行是 lvalue，中间两行是 rvalue。

**提示**：T&& 在这里是转发引用而不是右值引用，判断标准是 T 是否被推导为引用类型；不要用 is_rvalue_reference<T> 因为右值情况下 T 是非引用类型。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <type_traits>
#include <utility>

template <typename T>
void categorize(T&&) {
    if constexpr (std::is_lvalue_reference_v<T>) {
        std::cout << "lvalue" << std::endl;
    } else {
        std::cout << "rvalue" << std::endl;
    }
}

int main() {
    int a = 1;
    const int b = 2;
    categorize(a);
    categorize(b);
    categorize(5);
    categorize(std::move(a));
    categorize("literal");
}
```
传左值时 T 推导为 int&（引用折叠后 T&& 就是 int&），传右值时 T 推导为 int，所以「T 是不是左值引用」正好等价于「实参是不是左值」。字符串字面量是左值，被推导为 const char(&)[8]，因此同样打印 lvalue——转发引用对数组也不会退化成指针。

</details>

---

### 周三 · std::optional、std::variant 与 std::string_view —— 学习 / 1.5 小时

**今天学什么**

- std::optional<T> 表达「可能有值也可能没有」：用 has_value() 或 if (opt) 判断，value() 在无值时抛 std::bad_optional_access，value_or(x) 提供兜底值。
- std::variant<A,B> 是类型安全的联合体：用 holds_alternative/get_if 查询当前类型，用 std::visit 让编译器为每个可能类型各生成一份分支代码。
- std::string_view 是不拥有数据的字符串视图，构造与切片都是零拷贝，但只要源字符串被销毁或被修改，视图立刻悬垂。
- 这三者都是 C++17 的值语义工具，用来替换「返回 -1 表示失败」「void* 加类型标签」「const char* 加长度」这类易错的隐式约定。

**阅读**：《C++ Primer（第 5 版）》第 17 章 17.1 标准库特殊设施（tuple、bitset 等值语义工具的思想）；cppreference: std::optional、std::variant、std::string_view

**动手**

- 把一个「返回 -1 表示失败」的解析函数改写成返回 std::optional<int>，调用方用 value_or 与 if 两种风格处理。
- 用 std::variant<double, std::string> 表示「数值或错误信息」，用 std::visit 打印两种结果。

**完成标准**

- [ ] 能说出 optional 与「返回哨兵值」相比的两个好处
- [ ] parse_int 四种输入输出与预期一致
- [ ] safe_divide 两种结果都能正确打印并能用 get_if 取错误信息
- [ ] 能说明 string_view 的悬垂风险来自哪里

**课后题（2 道）**

#### 第 1 题 · 用 optional 表达可能失败的解析（难度 2/3）

实现 `std::optional<int> parse_int(const std::string& s)`，只接受可选的 +/- 号加至少一位数字，其余（空串、只有符号、含非数字字符）一律返回 std::nullopt，不允许抛异常。main 中分别对 "42"、"-7"、"abc"、"12x" 调用：前两个用 value_or(-1) 打印结果，后两个用 if (auto v = parse_int(...)) 判断并打印是否解析成功。验收：输出 42、-7、no value、no value。

**提示**：先处理符号位再逐字符检查是否落在 '0'~'9'，遇到非法字符立刻返回 nullopt；结果用 value * 10 + (s[i] - '0') 累积。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <optional>
#include <string>

std::optional<int> parse_int(const std::string& s) {
    if (s.empty()) return std::nullopt;
    std::size_t i = 0;
    bool negative = false;
    if (s[0] == '+' || s[0] == '-') {
        negative = (s[0] == '-');
        i = 1;
        if (s.size() == 1) return std::nullopt;
    }
    int value = 0;
    for (; i < s.size(); ++i) {
        if (s[i] < '0' || s[i] > '9') return std::nullopt;
        value = value * 10 + (s[i] - '0');
    }
    return negative ? -value : value;
}

int main() {
    std::cout << parse_int("42").value_or(-1) << std::endl;
    std::cout << parse_int("-7").value_or(-1) << std::endl;

    if (auto v = parse_int("abc")) std::cout << "got " << *v << std::endl;
    else std::cout << "no value" << std::endl;

    if (auto v = parse_int("12x")) std::cout << "got " << *v << std::endl;
    else std::cout << "no value" << std::endl;
}
```
optional 把「失败」编码进返回类型，调用方无法忽略它，也不会把 -1 这类哨兵值误当成合法数据。`if (auto v = opt)` 是 C++17 的初始化语句加 bool 转换，等价于先判断 has_value 再解引用。

</details>

#### 第 2 题 · 用 variant 表示「结果或错误」（难度 3/3）

定义 `using Result = std::variant<double, std::string>;`，实现 `Result safe_divide(double a, double b)`：b 为 0 时返回错误字符串 `division by zero`，否则返回商。main 中用 std::visit 打印两个结果（10/4 与 1/0），再用 holds_alternative 判断第一个结果是否为 double，用 get_if 取出第二个结果的错误信息。验收：输出 2.5、division by zero，holds=1，并能取到错误信息。

**提示**：std::visit 的 visitor 可以用泛型 lambda（参数写 const auto&），它会为 variant 的每个候选类型各实例化一次；get_if 返回指针，取不到时返回 nullptr。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <string>
#include <variant>

using Result = std::variant<double, std::string>;

Result safe_divide(double a, double b) {
    if (b == 0.0) return std::string("division by zero");
    return a / b;
}

int main() {
    const Result ok = safe_divide(10.0, 4.0);
    const Result bad = safe_divide(1.0, 0.0);

    std::visit([](const auto& v) { std::cout << v << std::endl; }, ok);
    std::visit([](const auto& v) { std::cout << v << std::endl; }, bad);

    std::cout << "holds double: " << std::holds_alternative<double>(ok) << std::endl;

    if (const std::string* err = std::get_if<std::string>(&bad)) {
        std::cout << "error=[" << *err << "]" << std::endl;
    } else {
        std::cout << "bad holds a double" << std::endl;
    }
}
```
variant 的当前类型是运行期信息，因此取错类型时 get 会抛 std::bad_variant_access，而 get_if 通过返回 nullptr 让你显式处理「类型不符」。std::visit 的泛型 lambda 让编译器为每个候选类型生成一份分支，比手写 if-else 加类型标签更安全。

</details>

---

### 周四 · 并发入门：thread、mutex、atomic、async —— 学习 / 1.5 小时

**今天学什么**

- std::thread 启动后必须 join（等它结束）或 detach，对象析构时仍处于 joinable 状态会直接调用 std::terminate。
- 多个线程无同步地读写同一变量是数据竞争，属于未定义行为；用 std::mutex 加 std::lock_guard 在作用域内成对加解锁，异常时也能自动释放。
- std::atomic<T> 对单个变量的读改写是原子的，适合计数器；但它无法保证「多个变量一起变化」的一致性，那种情况仍需要互斥锁。
- std::async 返回 std::future，get() 会阻塞等待结果并在调用线程重新抛出任务里的异常，适合「主线程等待若干个计算任务」的场景。

**阅读**：《C++ Primer（第 5 版）》第 17 章 17.1 标准库特殊设施（标准库设施的整体组织方式）；cppreference: std::thread、std::mutex、std::atomic、std::async

**动手**

- 起 4 个线程各把共享计数器加 1000000 次，先不加锁跑一次观察错误结果，再用 std::atomic 得到正确值。
- 用 std::async 并行计算两段数据的平方和并用 get() 汇总，再用 mutex 保护多线程写同一个 vector。Linux 下编译加 -pthread。

**完成标准**

- [ ] 能说出线程没 join 就析构会发生什么
- [ ] 第一轮计数结果小于期望值、第二轮严格等于 4000000
- [ ] async 版本输出 140，mutex 版本 size 为 200
- [ ] 编译时知道 Linux 需要 -pthread，并理解 lock_guard 的 RAII 作用

**课后题（2 道）**

#### 第 1 题 · 数据竞争与 atomic 修正（难度 2/3）

写程序：4 个线程各自把同一个 `long long` 计数器加 1000000 次，第一轮用普通变量（不加锁），打印结果与期望值 4000000 的差距；第二轮改用 `std::atomic<long long>` 并调用 fetch_add，打印结果确认等于 4000000。所有线程都必须 join。验收：第一轮结果通常小于 4000000，第二轮严格等于 4000000。

**提示**：普通变量的 ++ 是「读-改-写」三步，多个线程交错执行会丢更新；fetch_add 把这三步变成一条不可分割的原子操作。

<details>
<summary>参考答案</summary>

```cpp
#include <atomic>
#include <iostream>
#include <thread>
#include <vector>

int main() {
    const int per_thread = 1000000;
    const int thread_count = 4;
    const long long expected = static_cast<long long>(per_thread) * thread_count;

    long long unsafe_counter = 0;
    {
        std::vector<std::thread> pool;
        for (int i = 0; i < thread_count; ++i) {
            pool.emplace_back([&unsafe_counter, per_thread] {
                for (int j = 0; j < per_thread; ++j) ++unsafe_counter;
            });
        }
        for (std::thread& t : pool) t.join();
    }
    std::cout << "unsafe=" << unsafe_counter << " expected=" << expected << std::endl;

    std::atomic<long long> safe_counter{0};
    {
        std::vector<std::thread> pool;
        for (int i = 0; i < thread_count; ++i) {
            pool.emplace_back([&safe_counter, per_thread] {
                for (int j = 0; j < per_thread; ++j)
                    safe_counter.fetch_add(1, std::memory_order_relaxed);
            });
        }
        for (std::thread& t : pool) t.join();
    }
    std::cout << "safe=" << safe_counter.load() << std::endl;
}
```
第一轮的 ++ 不是原子操作，多个线程可能同时读到同一个旧值，因此结果通常小于期望值（注意这本身已经是未定义行为，只能作为反例观察）。第二轮用 fetch_add 保证每次自增不可分割；因为只有一个变量、不需要与其他内存操作建立顺序，用 memory_order_relaxed 就够了。

</details>

#### 第 2 题 · async 求和平行 + 用 mutex 保护共享容器（难度 3/3）

实现 `long long square_sum(const std::vector<int>& v)` 返回元素平方和。main 中：(1) 用两次 `std::async(std::launch::async, ...)` 分别计算 {1,2,3,4} 与 {5,6,7} 的平方和，用 future::get 相加并打印（期望 140）；(2) 起两个线程各自向同一个 `std::vector<int>` 追加 100 个元素，用 `std::lock_guard<std::mutex>` 保护 push_back，join 后打印 vector 的 size（期望 200）。

**提示**：async 的返回值要存在 future 里，get() 只能调用一次且会阻塞；mutex 与 lock_guard 必须定义在 main 栈上并被 lambda 按引用捕获。Linux 编译需要加 -pthread。

<details>
<summary>参考答案</summary>

```cpp
#include <future>
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

long long square_sum(const std::vector<int>& v) {
    long long sum = 0;
    for (int x : v) sum += static_cast<long long>(x) * x;
    return sum;
}

int main() {
    const std::vector<int> a{1, 2, 3, 4};
    const std::vector<int> b{5, 6, 7};

    std::future<long long> fa = std::async(std::launch::async, square_sum, a);
    std::future<long long> fb = std::async(std::launch::async, square_sum, b);
    std::cout << "total=" << fa.get() + fb.get() << std::endl;

    std::vector<int> shared;
    std::mutex mtx;
    auto worker = [&shared, &mtx](int base) {
        for (int i = 0; i < 100; ++i) {
            std::lock_guard<std::mutex> lock(mtx);
            shared.push_back(base + i);
        }
    };

    std::thread t1(worker, 0);
    std::thread t2(worker, 1000);
    t1.join();
    t2.join();
    std::cout << "shared size=" << shared.size() << std::endl;
}
```
async 的 launch::async 策略保证任务真的在另一个线程上跑（默认策略可能被推迟到 get 时才执行）。push_back 可能重新分配内存，属于典型的非线程安全操作，必须用锁把「修改容器」的整段代码串行化；lock_guard 在作用域结束时自动解锁，异常也不会漏解锁。

</details>

---

### 周五 · 项目阶段一：通讯录的数据模型与增删改查 —— 练习 / 1.5 小时

**今天学什么**

- 项目分三层最容易维护：数据模型（Contact 结构体）、存储层（ContactBook 管容器与增删改查）、交互层（菜单与输入解析），每层都能单独测试。
- 用 std::map<std::string, Contact> 以姓名为键，天然去重且查找 O(log n)，同时让遍历输出按姓名有序；需要按其他字段排序时再复制到 vector。
- 「查无此人」这类可预期结果适合用返回 bool 或指针（nullptr）表达，异常留给真正反常的情况，接口语义比强行抛异常更清晰。
- 输入校验要显式处理边界：std::getline 可能读失败、std::stoi 会抛 std::invalid_argument，坏输入必须在进入数据层之前被拦下。

**阅读**：《C++ Primer（第 5 版）》第 11 章 11.3 关联容器操作、第 8 章 8.1 IO 类（输入校验）；cppreference: std::map、std::getline、std::stoi

**动手**

- 搭出 Contact 与 ContactBook 骨架，实现 add/remove/find/list 四个操作并写最小 main 验证每个分支。
- 给手机号字段写一个校验函数（必须 11 位数字），拒绝非法输入并把错误信息返回给调用层。

**完成标准**

- [ ] ContactBook 五个接口都能独立跑通，重复插入与查无此人的语义正确
- [ ] 排序函数两种字段的输出与预期一致
- [ ] 能说出为什么用 map 作主存储、什么情况下要换成 vector
- [ ] 写下明天要实现的持久化文件格式（字段分隔与行结构）

**课后题（2 道）**

#### 第 1 题 · ContactBook 的四个基本操作（难度 2/3）

定义 `struct Contact { std::string name; std::string phone; std::string email; };`，实现类 `ContactBook`：`bool add(const Contact&)`（姓名已存在返回 false 且不覆盖）、`bool remove(const std::string&)`、`const Contact* find(const std::string&) const`（找不到返回 nullptr）、`std::vector<Contact> list() const`、`std::size_t size() const`，内部用 `std::map<std::string, Contact>`。main 中插入 amy、bob，再次插入 amy 验证返回 false，查找 bob 与不存在的 zed，删除 bob 与 zed，最后列出剩余联系人。验收：重复 add 返回 0，find("zed") 为 nullptr，remove("zed") 返回 0，列表只剩 amy。

**提示**：add 用 emplace(...).second；find 返回迭代器所指对象的地址（map 节点稳定，返回指针安全）；list 遍历 map 依次 push_back 即可，输出天然按姓名有序。

<details>
<summary>参考答案</summary>

```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Contact {
    std::string name;
    std::string phone;
    std::string email;
};

class ContactBook {
public:
    bool add(const Contact& c) {
        return contacts_.emplace(c.name, c).second;
    }

    bool remove(const std::string& name) {
        return contacts_.erase(name) == 1;
    }

    const Contact* find(const std::string& name) const {
        auto it = contacts_.find(name);
        if (it == contacts_.end()) return nullptr;
        return &it->second;
    }

    std::vector<Contact> list() const {
        std::vector<Contact> out;
        out.reserve(contacts_.size());
        for (const auto& kv : contacts_) out.push_back(kv.second);
        return out;
    }

    std::size_t size() const { return contacts_.size(); }

private:
    std::map<std::string, Contact> contacts_;
};

int main() {
    ContactBook book;
    std::cout << "add amy=" << book.add({"amy", "13800000001", "amy@example.com"})
              << " add bob=" << book.add({"bob", "13800000002", "bob@example.com"})
              << " add amy again=" << book.add({"amy", "13900000000", "x@example.com"})
              << std::endl;

    if (const Contact* c = book.find("bob"))
        std::cout << "found: " << c->name << ' ' << c->phone << std::endl;
    else
        std::cout << "bob not found" << std::endl;
    std::cout << "find zed is null: " << (book.find("zed") == nullptr) << std::endl;

    std::cout << "remove bob=" << book.remove("bob")
              << " remove zed=" << book.remove("zed") << std::endl;

    for (const Contact& c : book.list())
        std::cout << c.name << ',' << c.phone << ',' << c.email << std::endl;
    std::cout << "size=" << book.size() << std::endl;
}
```
map 的节点在插入后地址稳定，因此 find 返回指向节点内部的指针是安全的（只要不在持有期间删除该元素）。list() 返回的是值拷贝，调用方随便改都影响不到通讯录本体，这是接口设计上的隔离。

</details>

#### 第 2 题 · 按指定字段排序输出（难度 3/3）

在 ContactBook 上增加 `enum class SortField { Name, Phone };` 与 `std::vector<Contact> sorted_by(SortField field) const`：Name 时按姓名升序，Phone 时按电话号码升序、号码相同再按姓名升序。实现方式是把 map 的内容复制进 vector 后用 std::sort 加比较器。main 中插入 amy/13800000003、bob/13800000001、cy/13800000002，分别按两种字段打印。验收：按姓名输出 amy、bob、cy；按电话输出 bob、cy、amy。

**提示**：比较器需要捕获 field，用 if (field == SortField::Phone) 分支处理两种规则；枚举做参数时按值传即可。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Contact {
    std::string name;
    std::string phone;
};

enum class SortField { Name, Phone };

class ContactBook {
public:
    bool add(const Contact& c) {
        return contacts_.emplace(c.name, c).second;
    }

    std::vector<Contact> sorted_by(SortField field) const {
        std::vector<Contact> out;
        out.reserve(contacts_.size());
        for (const auto& kv : contacts_) out.push_back(kv.second);

        std::sort(out.begin(), out.end(), [field](const Contact& a, const Contact& b) {
            if (field == SortField::Phone) {
                if (a.phone != b.phone) return a.phone < b.phone;
                return a.name < b.name;
            }
            return a.name < b.name;
        });
        return out;
    }

private:
    std::map<std::string, Contact> contacts_;
};

int main() {
    ContactBook book;
    book.add({"amy", "13800000003"});
    book.add({"bob", "13800000001"});
    book.add({"cy", "13800000002"});

    std::cout << "by name: ";
    for (const Contact& c : book.sorted_by(SortField::Name)) std::cout << c.name << ' ';
    std::cout << std::endl;

    std::cout << "by phone: ";
    for (const Contact& c : book.sorted_by(SortField::Phone))
        std::cout << c.name << '(' << c.phone << ") ";
    std::cout << std::endl;
}
```
排序策略用枚举表达、用捕获了枚举的 lambda 实现，等于把第 6 周学的「比较器就是数据」落到了实际功能上。map 保证的只是按姓名有序，任何其他顺序都必须显式排序，这一点在设计接口时要说清楚。

</details>

---

### 周六 · 项目阶段二：持久化、排序、异常与所有权收尾 —— 项目 / 2 小时

**今天学什么**

- 文件持久化用 <fstream>：写用 std::ofstream 逐行输出，读用 std::ifstream + std::getline 逐行解析，每行一个联系人、字段用逗号分隔。
- 要区分「文件不存在」与「文件打不开」：第一次运行读不到文件是正常情况，load 应该返回 false 而不是抛异常；写失败才值得报错。
- 排序输出复用第 6 周的算法：把数据复制到 vector，用 sort 加捕获了排序字段的比较器，比试图让 map 支持多种顺序简单得多。
- 自定义异常继承 std::runtime_error，让调用方既能用 catch (const std::exception&) 统一兜底，也能按具体类型精确处理；unique_ptr 用来表达「独占拥有某对象」的所有权。

**阅读**：《C++ Primer（第 5 版）》第 8 章 8.2 文件输入输出、第 18 章 18.1 异常处理、第 12 章 12.1 动态内存与智能指针；cppreference: std::basic_fstream、std::runtime_error、std::unique_ptr

**动手**

- 给通讯录实现 save(path)/load(path)，格式为 name,phone,email 每行一条，写盘后再读回验证数量与字段完全一致。
- 定义 ContactError : std::runtime_error，在姓名重复与号码非法时抛出，并在 main 中分别捕获。

**完成标准**

- [ ] save/load 往返后人数与字段完全一致，缺失文件返回 false
- [ ] 重复新增与删除不存在的人都能抛出并捕获 ContactError
- [ ] 按电话排序输出正确，保存后最终人数为 3
- [ ] 项目用 unique_ptr 持有对象且无内存泄漏（能说清释放时机）

**课后题（2 道）**

#### 第 1 题 · 存盘与读回的往返一致性（难度 2/3）

给 ContactBook 实现 `bool save(const std::string& path) const` 与 `bool load(const std::string& path)`：保存格式为每行 `name,phone,email`；load 先清空现有数据，逐行用逗号切分字段；文件打不开时返回 false 而不抛异常。main 中写入 amy、bob 两人，保存到 `contacts_test.csv`，用一个全新的 ContactBook 读回并逐条打印，再对不存在的文件 `no_such_file.csv` 调用 load 验证返回 false。验收：读回人数为 2、字段与写入完全一致、缺失文件返回 0。

**提示**：写盘时逐行 out << name << ',' << phone << ',' << email << std::endl;；读盘时对每行构造 std::istringstream，再用带分隔符的 std::getline 依次取三个字段，这样字段里即使有空格也不会出错。

<details>
<summary>参考答案</summary>

```cpp
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

struct Contact {
    std::string name;
    std::string phone;
    std::string email;
};

class ContactBook {
public:
    bool add(const Contact& c) { return contacts_.emplace(c.name, c).second; }

    bool save(const std::string& path) const {
        std::ofstream out(path);
        if (!out) return false;
        for (const auto& kv : contacts_)
            out << kv.second.name << ',' << kv.second.phone << ',' << kv.second.email << std::endl;
        return static_cast<bool>(out);
    }

    bool load(const std::string& path) {
        std::ifstream in(path);
        if (!in) return false;
        contacts_.clear();
        std::string line;
        while (std::getline(in, line)) {
            if (line.empty()) continue;
            std::istringstream ls(line);
            Contact c;
            std::getline(ls, c.name, ',');
            std::getline(ls, c.phone, ',');
            std::getline(ls, c.email, ',');
            contacts_[c.name] = c;
        }
        return true;
    }

    std::size_t size() const { return contacts_.size(); }

    std::vector<Contact> list() const {
        std::vector<Contact> out;
        for (const auto& kv : contacts_) out.push_back(kv.second);
        return out;
    }

private:
    std::map<std::string, Contact> contacts_;
};

int main() {
    const std::string path = "contacts_test.csv";

    ContactBook writer;
    writer.add({"amy", "13800000001", "amy@example.com"});
    writer.add({"bob", "13800000002", "bob@example.com"});
    std::cout << "save=" << writer.save(path) << std::endl;

    ContactBook reader;
    std::cout << "load=" << reader.load(path) << " size=" << reader.size() << std::endl;
    for (const Contact& c : reader.list())
        std::cout << c.name << '|' << c.phone << '|' << c.email << std::endl;

    ContactBook missing;
    std::cout << "load missing file=" << missing.load("no_such_file.csv") << std::endl;
}
```
save 在最后用 static_cast<bool>(out) 检查流状态，能发现磁盘写入过程中的失败（如磁盘满）。load 里的 std::istringstream 加带分隔符的 getline 是解析 CSV 行最稳的做法，比手工 find(',') 更不容易漏掉空字段。

</details>

#### 第 2 题 · 完整闭环：异常、排序、持久化与 unique_ptr（难度 3/3）

把本周内容串成一个可运行的小项目：用 `std::unique_ptr<ContactBook>` 持有通讯录；实现 add(name,phone)（姓名为空或号码不是 11 位数字抛 `ContactError`，姓名重复也抛）、remove（不存在抛）、find（不存在抛）、sorted_by_phone()、save/load。main 中依次执行：尝试加载已有文件（允许失败）、新增 3 个联系人、故意重复新增 amy 并捕获异常、故意删除不存在的人并捕获异常、按电话排序打印、保存到文件并打印最终人数。验收：两个异常都被捕获并打印原因，排序输出按号码升序，保存成功且人数为 3。

**提示**：ContactError 继承 std::runtime_error 并转发构造函数；所有异常抛出点都带上出错的值，catch 时用 what() 打印；unique_ptr 用 new 构造，通过 -> 调用成员。

<details>
<summary>参考答案</summary>

```cpp
#include <algorithm>
#include <fstream>
#include <iostream>
#include <map>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

struct Contact {
    std::string name;
    std::string phone;
};

class ContactError : public std::runtime_error {
public:
    explicit ContactError(const std::string& msg) : std::runtime_error(msg) {}
};

class ContactBook {
public:
    void add(const std::string& name, const std::string& phone) {
        if (name.empty()) throw ContactError("empty name");
        if (phone.size() != 11) throw ContactError("invalid phone: " + phone);
        if (!contacts_.emplace(name, Contact{name, phone}).second)
            throw ContactError("duplicate name: " + name);
    }

    void remove(const std::string& name) {
        if (contacts_.erase(name) == 0) throw ContactError("not found: " + name);
    }

    const Contact& find(const std::string& name) const {
        auto it = contacts_.find(name);
        if (it == contacts_.end()) throw ContactError("not found: " + name);
        return it->second;
    }

    std::vector<Contact> sorted_by_phone() const {
        std::vector<Contact> out;
        out.reserve(contacts_.size());
        for (const auto& kv : contacts_) out.push_back(kv.second);
        std::sort(out.begin(), out.end(), [](const Contact& a, const Contact& b) {
            if (a.phone != b.phone) return a.phone < b.phone;
            return a.name < b.name;
        });
        return out;
    }

    bool save(const std::string& path) const {
        std::ofstream out(path);
        if (!out) return false;
        for (const auto& kv : contacts_)
            out << kv.second.name << ',' << kv.second.phone << std::endl;
        return static_cast<bool>(out);
    }

    bool load(const std::string& path) {
        std::ifstream in(path);
        if (!in) return false;
        contacts_.clear();
        std::string line;
        while (std::getline(in, line)) {
            std::size_t pos = line.find(',');
            if (line.empty() || pos == std::string::npos) continue;
            std::string name = line.substr(0, pos);
            contacts_[name] = Contact{name, line.substr(pos + 1)};
        }
        return true;
    }

    std::size_t size() const { return contacts_.size(); }

private:
    std::map<std::string, Contact> contacts_;
};

int main() {
    const std::string path = "address_book.csv";
    std::unique_ptr<ContactBook> book(new ContactBook());
    std::cout << "load existing file: " << book->load(path) << std::endl;

    try {
        book->add("amy", "13800000003");
        book->add("bob", "13800000001");
        book->add("cy", "13800000002");
        std::cout << "added 3 contacts, size=" << book->size() << std::endl;
    } catch (const ContactError& e) {
        std::cout << "add failed: " << e.what() << std::endl;
    }

    try {
        book->add("amy", "13800000009");
    } catch (const ContactError& e) {
        std::cout << "expected error: " << e.what() << std::endl;
    }

    try {
        book->remove("nobody");
    } catch (const ContactError& e) {
        std::cout << "expected error: " << e.what() << std::endl;
    }

    std::cout << "sorted by phone:" << std::endl;
    for (const Contact& c : book->sorted_by_phone())
        std::cout << c.phone << ' ' << c.name << std::endl;

    std::cout << "saved=" << book->save(path) << " final size=" << book->size() << std::endl;
}
```
自定义异常让「参数非法」与「状态不存在」可以用同一套 catch 处理，同时保留具体类型用于精确捕获；错误信息里带上出错的值，排查时不必再猜。unique_ptr 表达「这个通讯录对象由我独占」，离开作用域自动释放，这也是第 4 周 RAII 思想在项目中的落地。

</details>

---

### 周日 · 收尾与后续路线规划 —— 机动 / 30 分钟

**今天学什么**

- 回顾八周主线：类与 RAII → 容器与迭代器 → 算法与 lambda → 模板与泛型 → 移动语义、值语义工具与并发入门，这条线最终都收敛到「用类型和所有权表达意图」。

**阅读**：《C++ Primer（第 5 版）》第 13 章 13.6 与第 12 章 12.1（复习移动语义与智能指针）；cppreference: C++17 标准库总览页

**动手**

- 可选任务：给自己的通讯录项目补一份 README（功能、编译命令、文件格式）并跑通全流程；再写出后续 4 周的学习路线：C++20/23 新特性（ranges、concepts、coroutine）、并发深入（condition_variable、线程池）、构建与测试（CMake、单元测试框架）、性能与调试（perf、sanitizer）、阅读开源项目源码。

**完成标准**

- [ ] 回顾八周，能画出从类与 RAII 到移动语义与并发的知识脉络
- [ ] 四行解析结果与预期一致
- [ ] 项目 README 写完并能从零编译运行
- [ ] 写出后续 4 周的学习路线与每周可交付物

**课后题（1 道）**

#### 第 1 题 · 收尾练习：用 optional 与 string_view 解析命令行参数（难度 1/3）

实现 `std::optional<int> parse_count(std::string_view arg)`：形如 `--count=5` 的参数返回 5；前缀不对、缺少数值、数值含非数字字符时返回 std::nullopt。main 中依次对 "--count=5"、"--count=abc"、"count=5"、"--count=" 调用并打印结果，非法输入打印 invalid。验收：输出 5、invalid、invalid、invalid 四行。

**提示**：先比较前缀（用 string_view::substr 与常量比较），再用 std::stoi 解析剩余部分并捕获异常；注意 stoi 需要 std::string，string_view 要先显式构造。

<details>
<summary>参考答案</summary>

```cpp
#include <exception>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>

std::optional<int> parse_count(std::string_view arg) {
    const std::string_view prefix = "--count=";
    if (arg.size() <= prefix.size()) return std::nullopt;
    if (arg.substr(0, prefix.size()) != prefix) return std::nullopt;

    const std::string digits(arg.substr(prefix.size()));
    try {
        return std::stoi(digits);
    } catch (const std::exception&) {
        return std::nullopt;
    }
}

int main() {
    for (const char* raw : {"--count=5", "--count=abc", "count=5", "--count="}) {
        if (auto v = parse_count(raw)) std::cout << raw << " -> " << *v << std::endl;
        else std::cout << raw << " -> invalid" << std::endl;
    }
}
```
string_view 让前缀比较零拷贝，但 stoi 需要真正的 std::string，所以最后一步必须显式构造——这正好说明视图与所有权是两件事。optional 把「解析失败」写进类型，调用方必须处理，这正是本周值语义工具的典型用法。

</details>

---
