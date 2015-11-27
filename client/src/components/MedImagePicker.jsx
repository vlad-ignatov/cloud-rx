import { Component } from 'react'

const DEFAULT_IMAGE = '/img/meds.jpg'

export default class MedImagePicker extends Component
{
    static defaultProps = {
        med: null
    }

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.state = {
            med: props.med
        }
    }

    onChange(e) {
        let files  = e.target.files,
            length = files.length,
            i, f, reader;
        for (i = 0; i < length; i++) {
            f = files[i];
            //console.dir(f);
            if (f.type.match('image.*')) {

                reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (e) => {
                    console.log(e)
                    this.refs.img.src = e.target.result
                }

                // Read in the image file as a data URL.
                reader.readAsDataURL(f)

                break;
            }
        }
    }

    render() {
        return (
            <div className="med-image-picker">
                <img className="img-responsive"
                    src={ this.state.med.id ? this.state.med.small_image : DEFAULT_IMAGE }
                    alt={ this.state.med.id ? this.state.med.name : '' }
                    ref="img"
                    style={{ margin: 'auto' }}
                />
                <br/>
                <label>Medication Image</label>
                <input className="form-control"
                    type="file"
                    name="image"
                    onChange={ this.onChange }
                />
            </div>
        )
    }
}
