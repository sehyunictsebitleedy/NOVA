import { createSsoFinalizeHandler } from '@sebit-nova/ux/server'
import { novaAuthSettings } from '../../utils/nova'
export default createSsoFinalizeHandler(novaAuthSettings)
