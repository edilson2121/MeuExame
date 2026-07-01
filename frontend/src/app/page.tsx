import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="font-bold text-xl">ME</span>
          </div>

          <h1 className="text-2xl font-bold">
            Meu<span className="text-blue-400">Exame</span>
          </h1>

        </div>


        <div className="hidden md:flex gap-6 text-gray-300">

          <Link href="/courses" className="hover:text-white">
            Cursos
          </Link>

          <Link href="/institutions" className="hover:text-white">
            Instituições
          </Link>

          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>

        </div>

      </nav>



      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 items-center">


        <div>


          <span className="
          bg-blue-500/20 
          text-blue-300 
          px-4 py-2 
          rounded-full
          text-sm
          ">
            Plataforma de preparação
          </span>


          <h2 className="
          text-5xl md:text-7xl
          font-bold
          leading-tight
          mt-6
          ">

            Estude melhor.
            <br/>

            Passe nos seus
            <span className="text-blue-400">
              {" "}exames
            </span>

          </h2>



          <p className="
          mt-6
          text-lg
          text-gray-300
          max-w-xl
          ">

            Acesse exercícios, matérias e simulados
            das principais instituições de ensino.

          </p>



          <div className="mt-10 flex gap-4 flex-wrap">


            <Link
              href="/register"
              className="
              bg-blue-500
              px-8 py-4
              rounded-xl
              font-semibold
              hover:bg-blue-600
              transition
              "
            >
              Começar agora
            </Link>



            <Link
              href="/login"
              className="
              border border-white/30
              px-8 py-4
              rounded-xl
              hover:bg-white/10
              "
            >
              Entrar
            </Link>


          </div>


        </div>





        {/* Card lateral */}

        <div className="
        bg-white/10
        backdrop-blur-xl
        rounded-3xl
        p-8
        shadow-2xl
        border
        border-white/10
        ">


          <h3 className="text-2xl font-bold mb-6">
            Preparação completa
          </h3>



          <div className="space-y-4">


            <div className="bg-white/10 rounded-xl p-5">
              📚
              <b className="ml-3">
                Banco de questões
              </b>
              <p className="text-gray-300 mt-2">
                Pratique com exercícios atualizados
              </p>
            </div>



            <div className="bg-white/10 rounded-xl p-5">

              🏫
              <b className="ml-3">
                Instituições
              </b>

              <p className="text-gray-300 mt-2">
                UEM, UP, INATRO e outras
              </p>

            </div>




            <div className="bg-white/10 rounded-xl p-5">

              🚀
              <b className="ml-3">
                Evolução
              </b>

              <p className="text-gray-300 mt-2">
                Acompanhe seus estudos
              </p>

            </div>


          </div>


        </div>


      </section>





      {/* Estatísticas */}

      <section className="
      max-w-6xl
      mx-auto
      px-8
      grid
      md:grid-cols-3
      gap-6
      pb-16
      ">


        {[
          ["100+", "Questões"],
          ["20+", "Disciplinas"],
          ["5", "Simulados"],
        ].map((item)=>(
          
          <div
          key={item[1]}
          className="
          bg-white/10
          backdrop-blur
          p-6
          rounded-2xl
          text-center
          "
          >

            <h3 className="text-4xl font-bold text-blue-400">
              {item[0]}
            </h3>

            <p className="text-gray-300">
              {item[1]}
            </p>


          </div>

        ))}


      </section>


    </main>
  );
}