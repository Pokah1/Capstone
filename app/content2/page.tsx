// // pages/editor.tsx
// import { GetServerSideProps } from 'next';
// import { createClient } from '@/utils/supabase/server';
// import EditorPage from '@/components/contentEditor/editor2';
// import { User } from '@/types';

// export const getServerSideProps: GetServerSideProps<{ user: User }> = async (context) => {
//   const supabase = createClient();
//   const { req, res } = context;

//   const { data: { user }, error } = await supabase.auth.getUser();

//   if (error || !user) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user,
//     },
//   };
// };

// const Editor = ({ user }: { user: User }) => {
//   return <EditorPage user={user} />;
// };

// export default Editor;
