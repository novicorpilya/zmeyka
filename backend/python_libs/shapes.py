def draw_circle(turtle_obj, color, size, x, y):
    turtle_obj.penup()
    turtle_obj.color(color)
    turtle_obj.fillcolor(color)
    turtle_obj.goto(x, y)
    turtle_obj.pendown()
    turtle_obj.begin_fill()
    turtle_obj.circle(size)
    turtle_obj.end_fill()

def draw_square(turtle_obj, color, size, x, y):
    turtle_obj.penup()
    turtle_obj.color(color)
    turtle_obj.fillcolor(color)
    turtle_obj.goto(x, y)
    turtle_obj.pendown()
    turtle_obj.begin_fill()
    for _ in range(4):
        turtle_obj.forward(size)
        turtle_obj.left(90)
    turtle_obj.end_fill()

def draw_triangle(turtle_obj, color, size, x, y):
    turtle_obj.penup()
    turtle_obj.color(color)
    turtle_obj.fillcolor(color)
    turtle_obj.goto(x, y)
    turtle_obj.pendown()
    turtle_obj.begin_fill()
    for _ in range(3):
        turtle_obj.forward(size)
        turtle_obj.left(120)
    turtle_obj.end_fill()

def draw_star(turtle_obj, color, size, x, y):
    turtle_obj.penup()
    turtle_obj.color(color)
    turtle_obj.fillcolor(color)
    turtle_obj.goto(x, y)
    turtle_obj.pendown()
    turtle_obj.begin_fill()
    for _ in range(5):
        turtle_obj.forward(size)
        turtle_obj.right(144)
    turtle_obj.end_fill()
