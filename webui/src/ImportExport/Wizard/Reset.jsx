import React from 'react'
import { CAlert, CButton, CInputCheckbox, CLabel } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

export function ResetBeginStep() {
	return (
		<div>
			<p style={{ marginTop: 0 }}>Proceeding will allow you to reset some or all major components of this Companion installation.</p>
			<p>It is recommended to export the system configuration first.</p>

			<CButton color="success" href="/int/full_export" target="_new">
				<FontAwesomeIcon icon={faDownload} /> Export
			</CButton>
		</div>
	)
}

export function ResetOptionsStep({ config, setValue }) {
	return (
		<div>
			<h5>Reset Options</h5>
			<p>Please select the components you'd like to reset.</p>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_connections"
						checked={config.connections}
						onChange={(e) => setValue('connections', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_connections">Connections</CLabel>
				</div>
				{config.connections && !(config.buttons && config.triggers) ? (
					<CAlert color="warning">
						Resetting 'Connections' will remove all actions, feedbacks, and triggers associated with the connections
						even if 'Buttons' and/or 'Triggers' are not also reset.
					</CAlert>
				) : (
					''
				)}
			</div>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_buttons"
						checked={config.buttons}
						onChange={(e) => setValue('buttons', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_buttons">Buttons</CLabel>
				</div>
			</div>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_surfaces"
						checked={config.surfaces}
						onChange={(e) => setValue('surfaces', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_surfaces">Surfaces</CLabel>
				</div>
			</div>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_triggers"
						checked={config.triggers}
						onChange={(e) => setValue('triggers', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_triggers">Triggers</CLabel>
				</div>
			</div>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_custom_variables"
						checked={config.customVariables}
						onChange={(e) => setValue('customVariables', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_custom_variables">Custom Variables</CLabel>
				</div>
				{config.customVariables && !(config.connections && config.buttons && config.triggers) ? (
					<CAlert color="warning">
						Resetting 'Custom Variables' without also resetting 'Connections', 'Buttons', and/or 'Triggers' that may
						utilize them can create an unstable environment.
					</CAlert>
				) : (
					''
				)}
			</div>
			<div className="indent3">
				<div className="form-check form-check-inline mr-1">
					<CInputCheckbox
						id="wizard_userconfig"
						checked={config.userconfig}
						onChange={(e) => setValue('userconfig', e.currentTarget.checked)}
					/>
					<CLabel htmlFor="wizard_userconfig">Settings</CLabel>
				</div>
			</div>
		</div>
	)
}

export function ResetApplyStep({ config }) {
	let changes = []

	if (config.connections && !config.butons && !config.triggers) {
		changes.push(<li>All connections including their actions, feedbacks, and triggers.</li>)
	} else if (config.connections && !config.butons) {
		changes.push(<li>All connections including their button actions and feedbacks.</li>)
	} else if (config.connections && !config.triggers) {
		changes.push(<li>All connections including their triggers and trigger actions.</li>)
	} else if (config.connections) {
		changes.push(<li>All connections.</li>)
	}

	if (config.buttons) {
		changes.push(<li>All button styles, actions, and feedbacks.</li>)
	}

	if (config.surfaces) {
		changes.push(<li>All surface settings.</li>)
	}

	if (config.triggers) {
		changes.push(<li>All triggers.</li>)
	}

	if (config.customVariables) {
		changes.push(<li>All custom variables.</li>)
	}

	if (config.userconfig) {
		changes.push(<li>All settings, including enabled remote control services.</li>)
	}

	if (changes.length === 0) {
		changes.push(<li>No changes to the configuration will be made.</li>)
	}

	return (
		<div>
			<h5>Review Changes</h5>
			<p>The following data will be reset:</p>
			<ul>{changes}</ul>
			{changes.length > 0 ? <CAlert color="warning">Proceeding will permanently clear the above data.</CAlert> : ''}
		</div>
	)
}
