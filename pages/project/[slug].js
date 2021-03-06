import Image from "next/image";
import styles from "../../styles/Project.module.css";
import getBluredPlaceholder from "../../utils/getBluredPlaceholder";
import slugify from "../../utils/slugify";

export default function Project({ project }) {
	const { name, city, images, description } = project;

	return (
		<div className={styles.project}>
			<div className={styles.titles}>
				<h1 className={`${styles.project_name} secondary-title`}>{name}</h1>
				<h2 className={`${styles.project_city} secondary-title`}>{city}</h2>
			</div>
			<div className={styles.content}>
				<Image
					{...images[1].imageProps}
					placeholder="blur"
					objectFit="cover"
					objectPosition={`center ${images[1].horizontal}`}
					priority={true}
					quality={50}
				/>
				<div className={styles.main_content}>
					<div className={styles.main_image}>
						<Image
							alt={images[0].imageProps.alt}
							src={images[0].imageProps.src}
							placeholder="blur"
							blurDataURL={images[0].imageProps.blurDataURL}
							layout="fill"
							objectFit="cover"
							objectPosition={`center ${images[0].horizontal}`}
							priority={true}
							quality={50}
						/>
					</div>
					<p className={styles.text}>{description}</p>
				</div>
				<div className={styles.bottom_images}>
					<Image
						{...images[2].imageProps}
						placeholder="blur"
						objectFit="cover"
						objectPosition={`center ${images[2].horizontal}`}
						priority={true}
						quality={50}
					/>
					<Image
						{...images[3].imageProps}
						placeholder="blur"
						objectFit="cover"
						objectPosition={`center ${images[3].horizontal}`}
						priority={true}
						quality={50}
					/>
				</div>
			</div>
		</div>
	);
}

export async function getStaticPaths() {
	const { projects } = await import("../api/db.json");

	const paths = projects.map(({ name, city, id }) => ({
		params: { slug: slugify(id, name, city) },
	}));

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps(ctx) {
	const { projects } = await import("../api/db.json");

	const idx = Number(ctx.params.slug.split("-")[0]);
	const project = projects.find(({ id }) => idx === id);

	const images = await getBluredPlaceholder(project);

	return {
		props: {
			project: { ...project, images },
		},
	};
}
