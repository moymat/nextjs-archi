import Head from "next/head";
import Hero from "../components/index/Hero";
import About from "../components/index/About";
import Goals from "../components/index/Goals";
import Projects from "../components/index/Projects";
import Form from "../components/index/Form";

export default function Home({ projects }) {
	return (
		<>
			<Head>
				<title>Digital Project</title>
			</Head>
			<Hero
				projects={projects.filter(project => project.showcased === "HERO")}
			/>
			<About />
			<Goals />
			<Projects
				projects={projects
					.filter(project => project.showcased === "PROJECTS")
					.slice(0, 5)}
			/>
			<Form />)
		</>
	);
}

export async function getStaticProps() {
	const data = await import("./api/db.json");

	return {
		props: {
			projects: data.projects,
		},
	};
}
