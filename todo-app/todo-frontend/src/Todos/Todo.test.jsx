import renderer from "react-test-renderer";
import Todo from "./Todo";

it("displays correct information", () => {
  const todo = {
    text: "This is a todo",
    done: false,
  };

  const mockDeleteTodo = jest.fn();
  const mockCompleteTodo = jest.fn();

  const component = renderer.create(
    <Todo
      todo={todo}
      deleteTodo={mockDeleteTodo}
      completeTodo={mockCompleteTodo}
    />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  expect(tree.children[0].children[0]).toBe(todo.text);
});
