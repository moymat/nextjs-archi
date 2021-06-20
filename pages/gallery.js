import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/Gallery.module.css";
import Control from "../modules/Control";
import Counter from "../modules/Counter";

function cropSentences(sentence, length) {
	if (sentence.length <= length) return sentence;

	return `${sentence
		.split("")
		.slice(0, length + 1)
		.join("")
		.trim()} [...]`;
}

export default function Gallery({ images }) {
	const [currentPage, setCurrentPage] = useState(null);
	const [totalNumPages, setTotalNumPages] = useState(null);
	const [imagesArr, setImatesArr] = useState([]);

	useEffect(() => {
		const totalPages = Math.ceil(images.length / 10);

		let newImagesArr = [];
		for (let i = 0; i < totalPages; i++) {
			const step = i * 10;
			if (step + 10 >= images.length) newImagesArr.push(images.slice(step));
			else newImagesArr.push(images.slice(step, step + 10));
		}

		setImatesArr(newImagesArr);
		setCurrentPage(1);
		setTotalNumPages(totalPages);
	}, [images]);

	useEffect(() => {
		console.log(imagesArr);
	}, [imagesArr]);

	function handleArrowClick(direction) {
		if (direction === "right") {
			if (currentPage === totalNumPages) setCurrentPage(1);
			else setCurrentPage(currentPage + 1);
		} else if (direction === "left") {
			if (currentPage === 1) setCurrentPage(totalNumPages);
			else setCurrentPage(currentPage - 1);
		}
	}

	return (
		<section className={styles.gallery}>
			<h1 className={`${styles.title} secondary-title`}>Galerie</h1>
			<div className={styles.main_galery}>
				{imagesArr.map((arr, arrId) => (
					<div
						className={`${styles.gallery_container} ${
							currentPage - 1 === arrId
								? ""
								: currentPage - 1 > arrId
								? styles.hidden_left
								: styles.hidden_right
						}`}>
						{arr.map(({ path, id, name, city, imageDescription }, idx) => (
							<div className={styles.gallery_image} key={idx}>
								<Image
									src={path}
									alt={`${name} - ${id}`}
									layout="fill"
									objectFit="cover"
									objectPosition="center center"
									priority={currentPage - 1 === arrId}
									quality={10}
								/>
								<div className={styles.overlay}>
									<h2
										className={styles.overlay_title}>{`${name} - ${city}`}</h2>
									<h2 className={styles.overlay_description}>
										{cropSentences(imageDescription, 50)}
									</h2>
								</div>
							</div>
						))}
					</div>
				))}
			</div>
			<div className={styles.controllers}>
				<Counter current={currentPage} total={totalNumPages} />
				<Control handleClick={handleArrowClick} />
			</div>
		</section>
	);
}

export async function getStaticProps() {
	const { projects } = await import("./api/db.json");

	let imagesList = [];

	projects.forEach(({ name, city, images }) =>
		images.forEach(
			({ path, width, height, description: imageDescription }, id) => {
				imagesList.push({
					height,
					width,
					path,
					name,
					city,
					id,
					imageDescription,
				});
			}
		)
	);

	return {
		props: {
			images: imagesList,
		},
	};
}
