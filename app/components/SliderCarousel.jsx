import Carousel from 'react-bootstrap/Carousel';

export default function SliderCarousel({ slides, slideNumber }) {
    return (
        <Carousel
            indicators={false}
            slide={true}
            activeIndex={slideNumber}
            interval={null}
            controls={false}
            className='carousel-container'
        >
            <Carousel.Item>
                {slides[0].content}
            </Carousel.Item>

            <Carousel.Item>
                {slides[1].content}
            </Carousel.Item>

            <Carousel.Item>
                {slides[2].content}
            </Carousel.Item>

            <Carousel.Item>
                {slides[3].content}
            </Carousel.Item>

            <Carousel.Item>
                {slides[4].content}
            </Carousel.Item>

        </Carousel>
    )
}