import type { InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { prisma } from "src/server/db/client";
import { useState } from "react";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  todos,
}) => {
  const [text, setText] = useState('');
  const [todosList, setTodosList] = useState(todos);
  const {
    refetch: fetchTodos,
    isLoading: isFetchingTodos,
  } = trpc.todos.getAll.useQuery(undefined, {
    enabled: false,
    onSuccess(data) {
      setTodosList(data);
    },
  });
  const {
    mutate: addTodo,
    isLoading: isAdding,
  } = trpc.todos.add.useMutation({
    onSuccess: () => {
      fetchTodos();
    }
  });
  const {
    mutate: deleteTodo,
    isLoading: isDeleting,
  } = trpc.todos.delete.useMutation({
    onSuccess: () => {
      fetchTodos();
    }
  });
  const onAdd = () => {
    addTodo({
      text,
    });

    setText('');
  }
  const onDelete = (id: string) => {
    deleteTodo({
      id,
    });
  }

  return (
    <>
      <Head>
        <title>Laboratory Work 2</title>
        <meta name="description" content="Laboratory Work Nr 2" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-1/2 gap-2 mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div
          className="flex flex-col justify-start items-start w-full"
        >
          <label 
            htmlFor="todoText"
            className="text-xl font-bold pb-4"
          >Text</label>
          <textarea
            id="todoText"
            name="todoText"
            className="border w-full border-gray-300 rounded-md p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
           />
           <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={onAdd}
            disabled={isAdding}
           >
            Add
           </button>
        </div>
        {
          todosList
            .map(({ text, id }) => (
              <div
                key={id}
                className="bg-gray-200 p-4 rounded-md shadow-md w-full flex justify-between items-center"
              >
                <div>
                  {text}
                </div>
                <button
                  className="bg-red-400 p-2 rounded-md shadow-md"
                  onClick={() => onDelete(id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            ))
        }
      </main>
    </>
  );
};

export const getServerSideProps = async () => {
  const todos = await prisma.todo.findMany();

  return {
    props: {
      todos,
    }
  }
}

export default Home;
