import React from "react";
import errImg from "../assets/404 Error-pana.svg";
import { Link } from "react-router-dom";

const jokesDatabase = [
	"Why did the teacher wear sunglasses? Because her students were so bright!",
	"Why was the math book sad? Because it had too many problems.",
	"Why did the computer get cold at school? It left its Windows open!",
	"What’s a teacher’s favorite nation? Expla-nation!",
	"Why did the kid eat his homework? Because the teacher said it was a piece of cake!",
	"Why are ghosts bad at math? Because they get spooked by numbers!",
	"What do you call a teacher who loves to surf? A board of education.",
	"Why did the history teacher go to jail? She got caught pasting notes!",
	"Why is 6 afraid of 7? Because 7 ate 9!",
	"What’s the king of the school supplies? The ruler!",
	"Why did the pencil go to school? To become a sharpener!",
	"What’s a teacher’s favorite dessert? Pi.",
	"Why don’t you write with a broken pencil? Because it’s pointless!",
	"What did one pencil say to the other? You’re looking sharp!",
	"Why did the geography book break up with the math book? It found them too calculating!",
	"Why are school cafeterias so good at baseball? They always serve up a great pitch!",
	"Why was the broom late for school? It overswept!",
	"Why was the teacher cross-eyed? She couldn’t control her pupils!",
	"Why did the kid bring a ladder to school? To go to high school!",
	"Why did the art teacher go broke? She ran out of Monet.",
	"Why did the scarecrow become a great student? He was outstanding in his field!",
	"Why do science teachers love experiments? They always have great chemistry!",
	"Why did the clock get detention? It tocked too much in class!",
	"What’s a librarian’s favorite vegetable? Quiet peas.",
	"Why did the teacher jump into the pool? She wanted to test the water.",
	"What’s a snake’s favorite subject? Hissss-tory!",
	"Why did the student bring a flashlight to school? Because it was a bright idea!",
	"Why was the student afraid of school? Too many tests that were off the scale!",
	"Why are kindergarten teachers always calm? They know the ABCs of teaching.",
	"Why did the chalkboard get detention? It was too sketchy!",
	"Why are gym teachers so good at soccer? They know how to kick it!",
	"Why did the biology teacher go to the beach? She wanted to study the cells!",
	"Why are lockers such good listeners? They’re always open to your stories.",
	"Why did the teacher write on the window? She wanted the lesson to be clear!",
	"Why do music teachers have good discipline? They know how to handle notes.",
	"Why did the science teacher go to space? To explore new elements of education.",
	"Why are teachers so good at music? They have class!",
	"What do teachers and snow have in common? They both fall, but students make a mess of them.",
	"Why did the class book have so many followers? Because it had a great plot!",
	"Why was the school clock shy? It didn’t want to face time.",
	"Why don’t we ever tell secrets in the library? Because it’s a loud violation.",
	"Why did the student eat their test? They were trying to digest knowledge!",
	"Why was the geometry teacher so calm? Because he had all the right angles!",
	"Why don’t teachers like jokes about pencils? They don’t get the point.",
	"Why did the paper look so sad? It got torn apart by schoolwork.",
	"What did the glue say to the paper? Stick with me, and we’ll ace this project.",
	"Why are history classes so boring? Because they’re full of old news!",
	"What’s a teacher’s favorite thing to do at recess? Take roll—literally!",
	"Why are cafeterias so musical? They always have a good tray of food!",
	"What did the janitor say when he jumped out of the closet? Supplies!",
	"Why are PE teachers so inspiring? They help you reach your personal best.",
	"Why do students love math parties? Because they’re full of pi and cake!",
	"What’s the smartest animal in school? The spelling bee!",
	"Why did the student always carry a ladder? To reach new heights in learning!",
	"Why don’t we fight with pencils? Because they draw lines in the sand.",
	"Why did the eraser break up with the pencil? It felt rubbed the wrong way!",
	"Why do students carry extra pens? To write history.",
	"What’s a teacher’s favorite mode of transportation? The school bus-t!",
	"Why did the student put a ruler under their pillow? To measure how much they slept!",
	"What do you call an old biology book? Extinct!",
	"Why was the student afraid of the art project? It was too sketchy!",
	"Why don’t students eat too many math books? Because they might get a square meal!",
	"Why did the teacher put a clock on the roof? She wanted time to fly!",
	"What’s a teacher’s favorite drink? Tea-cher!",
	"Why do pencils make bad comedians? They have no point!",
	"Why are schools so smart? They have all the classes!",
	"Why don’t you give Elsa a balloon in class? Because she’ll let it go!",
	"Why don’t skeletons fight in school? They don’t have the guts!",
	"What’s a teacher’s favorite type of candy? Smarties!",
	"Why did the stapler stay after school? To make sure everything was together!",
	"Why don’t we trust atoms in science class? Because they make up everything!",
	"Why did the student sit on the floor in math class? They were trying to find their angle!",
];

const getRandomJoke = () => {
	return jokesDatabase[Math.floor(Math.random() * jokesDatabase.length)];
};

const NotFound = () => {
	const joke = getRandomJoke();

	return (
		<>
			<div className="text-center">
				<h4 className="text-7xl font-bold">Oops!</h4>
				<h4 className="text-2xl font-bold mt-4">
					You’ve Detoured from the Right Hallway! 🧭
				</h4>
				<p>
					It seems you’ve wandered into the digital equivalent of Room 404—where
					nobody ever has the right homework or knows what day it is! 😅
				</p>
			</div>
			<div className="flex justify-center">
				<img src={errImg} alt="err img" className="w-[40vw]" />
			</div>
			<div className="flex justify-center align-top my-4">
				<div className="w-full md:w-1/2 flex justify-center">
					<div>
						<h4 className="text-2xl font-bold">What Might Have Happened?</h4>
						<ul className="list-disc mt-4">
							<li>You missed the bell and ran into a broken link.</li>
							<li>Someone "borrowed" this page for extra credit.</li>
							<li>The page went on a field trip and hasn’t returned yet.</li>
						</ul>
					</div>
				</div>

				<div className="w-full md:w-1/2 flex justify-center">
					<div>
						<h4 className="text-2xl font-bold">What Can You Do?</h4>
						<ul className="list-disc mt-4">
							<li>
								Head Back to Class:{" "}
								<Link to="/" className="text-lg font-bold text-emerald-800">
									Go to Homepage
								</Link>
							</li>
							<li>
								Raise Your Hand:{" "}
								<Link
									to="/Support"
									className="text-lg font-bold text-emerald-800"
								>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="text-lg text-center mt-12 mb-8">
				<p>In the meantime, here’s a joke to cheer you up:</p>
				<p>{joke}</p>
			</div>
			<p className="text-center text-sm">
				Don’t worry, we’ll help you find your way. Even the best students get
				lost sometimes! 🏫✨
			</p>
		</>
	);
};

export default NotFound;
